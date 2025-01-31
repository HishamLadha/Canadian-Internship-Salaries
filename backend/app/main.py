from fastapi import FastAPI, Path, Query
from pydantic import BaseModel
from sqlmodel import Field, SQLModel, create_engine, Session, select
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd


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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# The ** (double asterisk) operator is used for dictionary unpacking. It takes the key-value pairs in the record dictionary and passes them as keyword arguments to the ReportedSalary constructor.
# parsing the script to create the database and tables
def load_csv_data():
    csv_file = "/app/data/ConcordiaResponses.csv"
    df = pd.read_csv(csv_file)

    df = df.drop(columns=["Timestamp"])
    df["term"] = df["term"].str.extract(r'(\d+)').astype(int)
    df["university"] = "Concordia University"

    # Convert the DataFrame to a list of dictionaries
    data = df.to_dict(orient="records")
    # Now insert each salary into the database
    with Session(engine) as session:
        for record in data:
            salary = ReportedSalary(**record)
            session.add(salary)
        session.commit()
    
    print("Data successfully added to database!!")

load_csv_data()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.post("/submit-salary", response_model=ReportedSalary)
def create_salary(reportedSalary: ReportedSalary):
    with Session(engine) as session:
        session.add(reportedSalary)
        session.commit()
        session.refresh(reportedSalary)
        return reportedSalary
    
@app.get("/all-salaries", response_model=list[ReportedSalary])
def read_salaries():
    with Session(engine) as session:
        salaries = session.exec(select(ReportedSalary)).all()
        return salaries

@app.get("/all-companies", response_model=list[str])
def read_companies():
    with Session(engine) as session:
        # return only the unique company names
        companies = session.exec(select(ReportedSalary.company).distinct()).all()
        return companies

@app.get("/company", response_model=list[ReportedSalary])
def get_company(company: str):
    with Session(engine) as session:
        companies = session.exec(select(ReportedSalary).where(ReportedSalary.company == company)).all()
        return companies

