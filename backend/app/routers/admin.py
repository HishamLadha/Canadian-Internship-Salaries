from fastapi import APIRouter, Depends, HTTPException, Request
from typing import List
from sqlmodel import Session
from ..auth import get_admin_user
from ..database import get_session
from ..models.pending_salary import PendingSalary, SubmissionStatus
from ..models.salary import ReportedSalary
from ..core.rate_limiter import limiter
from ..data_loader import load_csv_data, load_universities_json


router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/pending-submissions", response_model=List[PendingSalary])
@limiter.limit("10/minute")
async def get_pending_submissions(
    request: Request,  # Required for rate limiter
    admin: dict = Depends(get_admin_user),
    session: Session = Depends(get_session)
):
    return session.query(PendingSalary).filter(
        PendingSalary.status == SubmissionStatus.PENDING
    ).all()

@router.post("/approve/{submission_id}")
async def approve_submission(
    request: Request,  # Required for rate limiter
    submission_id: int,
    admin: dict = Depends(get_admin_user),
    session: Session = Depends(get_session)
):
    pending = session.get(PendingSalary, submission_id)
    if not pending:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    # Create approved salary entry
    approved_salary = ReportedSalary(**pending.dict(exclude={'id', 'status', 'ip_address', 'submitted_at'}))
    session.add(approved_salary)
    
    # Update pending status
    pending.status = SubmissionStatus.APPROVED
    session.commit()
    
    return {"message": "Submission approved"}

@router.post("/reject/{submission_id}")
async def reject_submission(
    request: Request,  # Required for rate limiter
    submission_id: int,
    admin: dict = Depends(get_admin_user),
    session: Session = Depends(get_session)
):
    pending = session.get(PendingSalary, submission_id)
    if not pending:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    # Update pending status to rejected
    pending.status = SubmissionStatus.REJECTED
    session.commit()
    
    return {"message": "Submission rejected"}


@router.get("/populate-db")
@limiter.limit("5/minute")
async def populate_db(
    request: Request,  # Required for rate limiter
    admin: dict = Depends(get_admin_user),
    session: Session = Depends(get_session)
):
    load_csv_data()
    load_universities_json()