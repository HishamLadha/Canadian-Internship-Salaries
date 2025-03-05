from sqlmodel import Field, SQLModel

# Model for the Reported Salary Table
class ReportedSalary(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    company: str
    year: int
    salary: float
    university: str 
    term: int | None = None
    location: str
    bonus: float | None = None
    role: str