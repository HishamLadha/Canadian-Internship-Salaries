from fastapi import APIRouter, Depends, HTTPException, Request
from typing import List
from sqlmodel import Session, select  
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
    request: Request,  
    admin: dict = Depends(get_admin_user),
    session: Session = Depends(get_session)
):
    return session.query(PendingSalary).filter(
        PendingSalary.status == SubmissionStatus.PENDING
    ).all()

@router.post("/approve/{submission_id}")
async def approve_submission(
    request: Request, 
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
    request: Request, 
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
    request: Request,  
    admin: dict = Depends(get_admin_user),
    session: Session = Depends(get_session)
):
    load_csv_data()
    load_universities_json()

# remove the wrong locations
# instead of toronto, on, canada, it should be toronto, on
@router.get("/modify-db")
@limiter.limit("5/minute")
async def modify_db(
    request: Request,  
    admin: dict = Depends(get_admin_user),
    session: Session = Depends(get_session)
):
    salaries_to_update = session.exec(select(ReportedSalary)).all()
    updated_count = 0
    for salary in salaries_to_update:
        if salary.location and salary.location.count(',') > 1:
            parts = salary.location.split(',')
            new_location = f"{parts[0].strip()}, {parts[1].strip()}"
            if salary.location != new_location:
                salary.location = new_location
                session.add(salary)
                updated_count += 1
    
    if updated_count > 0:
        session.commit()
        return {"message": f"Database modified. {updated_count} location(s) updated."}
    else:
        return {"message": "No locations needed an update."}
