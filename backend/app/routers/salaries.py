from fastapi import APIRouter, Depends
from sqlmodel import select, Session, desc
from typing import List
from ..models.salary import ReportedSalary
from ..database import get_session

router = APIRouter()

@router.post("/submit-salary", response_model=ReportedSalary)
def create_salary(reportedSalary: ReportedSalary, session: Session = Depends(get_session)):
    session.add(reportedSalary)
    session.commit()
    session.refresh(reportedSalary)
    return reportedSalary

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