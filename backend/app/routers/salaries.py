from fastapi import APIRouter, Depends, Request, HTTPException
from sqlmodel import select, Session, desc
from typing import List
from ..models.salary import ReportedSalary
from ..database import get_session
from ..models.pending_salary import PendingSalary, SubmissionStatus
from ..core.rate_limiter import limiter

router = APIRouter()

@router.post("/submit-salary")
@limiter.limit("5/hour")  # 5 submissions per hour per IP
async def submit_salary(
    request: Request,
    salary_data: ReportedSalary,
    session: Session = Depends(get_session)
):
    try:
        # Modify the location to remove content after the last comma
        if salary_data.location and ',' in salary_data.location:
            last_comma_index = salary_data.location.rfind(',')
            salary_data.location = salary_data.location[:last_comma_index].strip()

        # Now actually create the pending submission
        pending_salary = PendingSalary(
            **salary_data.dict(),
            ip_address=request.client.host,
            status=SubmissionStatus.PENDING
        )
        
        session.add(pending_salary)
        session.commit()
        
        return {"message": "Submission received and pending review", "id": pending_salary.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# TODO: Make this endpoing work with limit and offset and sync this with front-end pagination for efficiency
@router.get("/all-salaries", response_model=list[ReportedSalary])
def read_salaries(session: Session = Depends(get_session)):
    salaries = session.exec(select(ReportedSalary).order_by(desc(ReportedSalary.year))).all()
    return salaries

popular_internship_roles = [
    "Software Developer",
    "Business Analyst",
    "Chemical Engineer Intern",
    "Civil Engineer Intern",
    "Consulting Intern",
    "Data Scientist",
    "Electrical Engineer Intern",
    "Environmental Engineer Intern",
    "Finance Intern",
    "Designer Intern",
    "Human Resources Intern",
    "Industrial Engineer Intern",
    "IT Intern",
    "Journalism Intern",
    "Marketing Intern",
    "Mechanical Engineer Intern",
    "Operations Intern",
    "Product Manager",
    "Sales Intern",
    "Other",
]

# TODO: Find a better fix for this
@router.get("/internship-roles")
def get_internship_roles():
    return popular_internship_roles