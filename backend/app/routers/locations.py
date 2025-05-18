from fastapi import APIRouter, Depends
from sqlmodel import select, Session, desc, func
from typing import List
from ..models.salary import ReportedSalary
from ..database import get_session

router = APIRouter()

@router.get("/all-locations", response_model=list[str])
def read_locations(session: Session = Depends(get_session)):
    # return only the unique locations
    locations = session.exec(select(ReportedSalary.location).distinct()).all()
    return locations

@router.get("/location/all-salaries", response_model=list[ReportedSalary])
def get_location(location: str, session: Session = Depends(get_session)):
    locationData = session.exec(select(ReportedSalary).where(ReportedSalary.location == location).order_by(desc(ReportedSalary.year))).all()
    return locationData

@router.get("/location/average-salary")
def get_location_average(location: str, session: Session = Depends(get_session)):
    locationAverage = session.exec(select(func.avg(ReportedSalary.salary)).where(ReportedSalary.location == location)).first()
    return locationAverage if locationAverage is not None else 0.0
    
@router.get("/location/top-university")
def get_location_top_university(location: str, session: Session = Depends(get_session)):
    top_university = session.exec(
        select(ReportedSalary.university, func.count(ReportedSalary.university))
        .where(ReportedSalary.location == location)
        .group_by(ReportedSalary.university)
        .order_by(func.count(ReportedSalary.university).desc())
        .limit(1)
    ).first()
    return {top_university[0]}

@router.get("/location/top-company")
def get_location_top_location(location: str, session: Session = Depends(get_session)):
    top_location = session.exec(
        select(ReportedSalary.company, func.count(ReportedSalary.company))
        .where(ReportedSalary.location == location)
        .group_by(ReportedSalary.company)
        .order_by(func.count(ReportedSalary.company).desc())
        .limit(1)
    ).first()
    return {top_location[0]}

