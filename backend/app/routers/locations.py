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

