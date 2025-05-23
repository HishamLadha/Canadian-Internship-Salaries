from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from ..database import get_session
from ..models.roles import Role

router = APIRouter()

@router.get("/all-roles", response_model=list[str])
def read_roles(session: Session = Depends(get_session)):
    all_roles = session.exec(select(Role.role_name).distinct()).all()
    return all_roles


