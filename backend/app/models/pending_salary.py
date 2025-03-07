from sqlmodel import SQLModel, Field
from datetime import datetime
from enum import Enum

class SubmissionStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class PendingSalary(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    company: str
    salary: float
    role: str
    location: str
    year: int
    university: str
    bonus: float | None = None
    term: int | None = None
    status: SubmissionStatus = Field(default=SubmissionStatus.PENDING)
    ip_address: str
    submitted_at: datetime = Field(default_factory=datetime.utcnow)