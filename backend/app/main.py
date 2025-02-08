# TODO: split this file into multiple files
from fastapi import FastAPI, Path, Query
from pydantic import BaseModel
from sqlmodel import Field, SQLModel, create_engine, Session, select, desc, func
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd


load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
FRONTEND_URL = os.getenv("FRONTEND_URL")


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
    allow_origins=[FRONTEND_URL],
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
    df["role"] = "Unreported"

    # Define a dictionary of replacements
    replacements = {
        "Pratt & Whitney": "Pratt and Whitney",
        "Pratt & Whitney Canada": "Pratt and Whitney",
        "Pratt and Whitney Canada": "Pratt and Whitney",
        "Pratt & whitney canada": "Pratt and Whitney",
        "Pratt and Whitney ": "Pratt and Whitney"
    }
    df['company'] = df['company'].replace(replacements)

    # Convert the DataFrame to a list of dictionaries
    data = df.to_dict(orient="records")
    # Now insert each salary into the database
    with Session(engine) as session:
        for record in data:
            salary = ReportedSalary(**record)
            session.add(salary)
        session.commit()
    
    print("Data successfully added to database!!")

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    # load_csv_data()

@app.post("/submit-salary", response_model=ReportedSalary)
def create_salary(reportedSalary: ReportedSalary):
    with Session(engine) as session:
        session.add(reportedSalary)
        session.commit()
        session.refresh(reportedSalary)
        return reportedSalary

# TODO: Make this endpoing work with limit and offset and sync this with front-end pagination for efficiency
@app.get("/all-salaries", response_model=list[ReportedSalary])
def read_salaries():
    with Session(engine) as session:
        salaries = session.exec(select(ReportedSalary).order_by(desc(ReportedSalary.year))).all()
        return salaries

@app.get("/all-companies", response_model=list[str])
def read_companies():
    with Session(engine) as session:
        # return only the unique company names
        companies = session.exec(select(ReportedSalary.company).distinct()).all()
        return companies


# TODO: distill into multiple endpoints: /company/all-salaries, /company/average-salary, /company/top-university, /company/top-location
@app.get("/company/all-salaries", response_model=list[ReportedSalary])
def get_company(company: str):
    with Session(engine) as session:
        companyData = session.exec(select(ReportedSalary).where(ReportedSalary.company == company).order_by(desc(ReportedSalary.year))).all()
        return companyData

@app.get("/company/average-salary")
def get_company_average(company: str):
    with Session(engine) as session:
        companyAverage = session.exec(select(func.avg(ReportedSalary.salary)).where(ReportedSalary.company == company)).first()
        return companyAverage if companyAverage is not None else 0.0
    
@app.get("/company/top-university")
def get_company_top_university(company: str):
    with Session(engine) as session:
        top_university = session.exec(
            select(ReportedSalary.university, func.count(ReportedSalary.university))
            .where(ReportedSalary.company == company)
            .group_by(ReportedSalary.university)
            .order_by(func.count(ReportedSalary.university).desc())
            .limit(1)
        ).first()
        return {top_university[0]}
        


@app.get("/company/top-location")
def get_company_top_location(company: str):
    with Session(engine) as session:
        top_location = session.exec(
            select(ReportedSalary.location, func.count(ReportedSalary.location))
            .where(ReportedSalary.company == company)
            .group_by(ReportedSalary.location)
            .order_by(func.count(ReportedSalary.location).desc())
            .limit(1)
        ).first()
        return {top_location[0]}

    

