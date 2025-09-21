import pandas as pd
import json
from .database import engine, Session
from .models.salary import ReportedSalary
from .models.university import Universities
from .models.roles import Role

# The ** (double asterisk) operator is used for dictionary unpacking. It takes the key-value pairs in the record dictionary and passes them as keyword arguments to the ReportedSalary constructor.
# parsing the script to create the database and tables
def load_csv_data():
    csv_file = "/app/data/ConcordiaResponses.csv"
    df = pd.read_csv(csv_file)

    df = df.drop(columns=["Timestamp"])
    df["term"] = df["term"].str.extract(r'(\d+)').astype(int)
    df["university"] = "Concordia University"
    df["role"] = "Unreported"

    # Strip whitespace from company names
    df['company'] = df['company'].str.strip()

    # Define a dictionary of replacements
    company_replacements = {
        "Pratt & Whitney": "Pratt and Whitney",
        "Pratt & Whitney Canada": "Pratt and Whitney",
        "Pratt and Whitney Canada": "Pratt and Whitney",
        "Pratt & whitney canada": "Pratt and Whitney",
        "Pratt and Whitney ": "Pratt and Whitney",
        "Airbus-ACE": "Airbus",
        "Ibwave": "iBwave",
        "CN National Railway (Internship)": "CN",
        "Health systems R&A": "Healthcare Systems R&A",
        "Intact Financial Corp": "Intact",
        "Sun Life Financial Canada": "Sun Life Financial",
        "Samsung Ads | AdGear": "Samsung",
        "Tangerine Software": "Tangerine Bank",
        "ticketmaster": "Ticker Master",
        "ubicquia":"Ubicquia",
        "X2O media": "X2O Media",
    }
    df['company'] = df['company'].replace(company_replacements)

    location_replacements = {
        # Quebec locations
        "Montreal": "Montreal, QC",
        "Mirabel": "Mirabel, QC",
        "West Island": "Montreal, QC",
        "St-Laurent": "Saint-Laurent, QC",
        "St-Bruno": "Saint-Bruno, QC",
        "Vaudreuil Dorion": "Vaudreuil-Dorion, QC",
        "Sorel-Tracy": "Sorel-Tracy, QC",
        "Dorval": "Dorval, QC",
        "South Shore": "Montreal, QC",
        "Laval": "Laval, QC",
        "remote": "Remote",
        "Remote": "Remote",
        "Saint hubert": "Saint-Hubert, QC",
        "St-Hubert": "Saint-Hubert, QC",
        "Brossard": "Brossard, QC",
        "Québec": "Quebec City, QC",
        "Québec ": "Quebec City, QC",
        "Quebec": "Quebec City, QC",
        "Quebec City": "Quebec City, QC",
        "Boisbriand ": "Boisbriand, QC",
        "Contrecoeur": "Contrecoeur, QC",
        "Amos": "Amos, QC",

        # Ontario locations
        "toronto": "Toronto, ON",
        "Toronto": "Toronto, ON",
        "Waterloo": "Waterloo, ON",
        "Ottawa": "Ottawa, ON",

        # British Columbia locations
        "Vancouver": "Vancouver, BC",

        # Nova Scotia locations
        "Halifax": "Halifax, NS",

        # US locations
        "New York City": "New York City, NY",
        "Bay Area": "Bay Area, CA",
        "San Francisco": "San Francisco, CA",
        "San Jose": "San Jose, CA",
        "Seattle": "Seattle, WA"
    }
    df['location'] = df['location'].str.strip().replace(location_replacements)

    # Convert the DataFrame to a list of dictionaries
    data = df.to_dict(orient="records")
    # Now insert each salary into the database
    with Session(engine) as session:
        for record in data:
            salary = ReportedSalary(**record)
            session.add(salary)
        session.commit()
    
    print("All salaries successfully added to database!!")

def load_waterloo_data():
    csv_file = "/app/data/CleanWaterloo.csv"
    df = pd.read_csv(csv_file)
    
    df['salary'] = pd.to_numeric(df['salary'], errors='coerce')
    df['bonus'] = pd.to_numeric(df['bonus'], errors='coerce')
    
    df['term'] = pd.to_numeric(df['term'], errors='coerce')
    df['term'] = df['term'].fillna(0).astype('Int64') 
    
    df = df.dropna(subset=['salary'])
    
    data = df.to_dict(orient="records")
    
    with Session(engine) as session:
        try:
            # commit all entries from CSV (with NaN locations)
            for i, record in enumerate(data):
                salary = ReportedSalary(
                    company=record.get('company'),
                    year=int(record.get('year')) if record.get('year') else None,
                    salary=float(record.get('salary')) if record.get('salary') else None,
                    university=record.get('university'),
                    term=int(record.get('term')) if record.get('term') and record.get('term') != 0 else None,
                    location=record.get('location'),
                    bonus=float(record.get('bonus')) if record.get('bonus') else None,
                    role=record.get('role'),
                    arrangement=record.get('arrangement')
                )
                session.add(salary)
            
            # Commit the initial data
            session.commit()
            print("Initial data committed to database")
            
            #  update all entries where location is NULL/empty to "Canada"
            from sqlmodel import update
            
            # Update records where location is None, empty string, or 'nan'
            stmt = update(ReportedSalary).where(
                (ReportedSalary.location.is_(None)) | 
                (ReportedSalary.location == '') |
                (ReportedSalary.location == 'nan') |
                (ReportedSalary.location == 'NaN')
            ).values(location="Canada")
            
            result = session.exec(stmt)
            session.commit()
            
            print(f"Updated {result.rowcount} records with location 'Canada'")
            print("All Waterloo salaries successfully added to database!!")
            
        except Exception as e:
            session.rollback()
            print(f"Error inserting data: {e}")
            raise

def load_universities_json():
    with open("/app/data/CanadianUniversities.json", "r") as file:
        universities_data = json.load(file)

    with Session(engine) as session:
        for uni in universities_data:
            university = Universities(name=uni["name"], domains=uni["domains"])
            session.add(university)
        session.commit()
    print("Universities successfully added to database!!")

def seed_roles():
    popular_internship_roles = [
    "Software Developer",
    "Software Engineer",
    "Business Analyst",
    "Chemical Engineer",
    "Civil Engineer",
    "Consulting",
    "Data Scientist",
    "Electrical Engineer",
    "Environmental Engineer",
    "Finance",
    "Designer",
    "Human Resources",
    "Industrial Engineer",
    "IT",
    "Journalism",
    "Marketing",
    "Mechanical Engineer",
    "Operations",
    "Product Manager",
    "Sales",
    ]
    with Session(engine) as session:
        for role in popular_internship_roles:
            role_object = Role(role_name=role)
            session.add(role_object)
        session.commit()
        print("Internship roles successfully added")

def fix_incorrect_role():
    with Session(engine) as session:
        # Delete incorrect entry
        session.query(Role).filter(Role.role_name == "Software EngineerBusiness Analyst").delete()
        
        # Add correct entries
        session.add(Role(role_name="Software Engineer"))
        session.add(Role(role_name="Business Analyst"))
        
        session.commit()
        print("Role entry fixed successfully")