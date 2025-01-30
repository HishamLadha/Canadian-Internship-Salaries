from fastapi import FastAPI
from pydantic import BaseModel
from sqlmodel import Field, SQLModel, create_engine, Session, select
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")


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

connect_args = {"check_same_thread": False}

# create the engine to talk to the database
engine = create_engine(DATABASE_URL, echo=True)

# create the database and tables in a function to prevent side effects
# for example, if main.py is imported in another file, we don't want it to create the database
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.post("/submit-salary")
def create_salary(reportedSalary: ReportedSalary):
    with Session(engine) as session:
        session.add(reportedSalary)
        session.commit()
        session.refresh(reportedSalary)
        return reportedSalary
    
@app.get("/all-salaries")
def read_salaries():
    with Session(engine) as session:
        salaries = session.exec(select(ReportedSalary)).all()
        return salaries