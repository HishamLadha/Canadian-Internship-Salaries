from fastapi import APIRouter, Depends
from sqlmodel import select, Session
from typing import List
from ..models.university import Universities
from ..database import get_session

router = APIRouter()

@router.get("/all-universities", response_model=List[str])
def read_universities(session: Session = Depends(get_session)):
    universities = session.exec(select(Universities.name)).all()
    return universities