from sqlmodel import Field, SQLModel

# Model for the Reported Salary Table
class ReportedSalary(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    company: str
    year: int
    salary: int
    university: str 
    term: int | None = None
    location: str
    bonus: int | None = None
    role: str