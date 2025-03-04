from fastapi import APIRouter, Depends
from sqlmodel import select, Session, desc, func
from typing import List
from ..models.salary import ReportedSalary
from ..database import get_session

router = APIRouter()

@router.get("/all-companies", response_model=list[str])
def read_companies(session: Session = Depends(get_session)):
    # return only the unique company names
    companies = session.exec(select(ReportedSalary.company).distinct()).all()
    return companies

@router.get("/company/all-salaries", response_model=list[ReportedSalary])
def get_company(company: str, session: Session = Depends(get_session)):
    companyData = session.exec(select(ReportedSalary).where(ReportedSalary.company == company).order_by(desc(ReportedSalary.year))).all()
    return companyData

@router.get("/company/average-salary")
def get_company_average(company: str, session: Session = Depends(get_session)):
    companyAverage = session.exec(select(func.avg(ReportedSalary.salary)).where(ReportedSalary.company == company)).first()
    return companyAverage if companyAverage is not None else 0.0
    
@router.get("/company/top-university")
def get_company_top_university(company: str, session: Session = Depends(get_session)):
    top_university = session.exec(
        select(ReportedSalary.university, func.count(ReportedSalary.university))
        .where(ReportedSalary.company == company)
        .group_by(ReportedSalary.university)
        .order_by(func.count(ReportedSalary.university).desc())
        .limit(1)
    ).first()
    return {top_university[0]}

@router.get("/company/top-location")
def get_company_top_location(company: str, session: Session = Depends(get_session)):
    top_location = session.exec(
        select(ReportedSalary.location, func.count(ReportedSalary.location))
        .where(ReportedSalary.company == company)
        .group_by(ReportedSalary.location)
        .order_by(func.count(ReportedSalary.location).desc())
        .limit(1)
    ).first()
    return {top_location[0]}