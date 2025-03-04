import pandas as pd
import json
from .database import engine, Session
from .models.salary import ReportedSalary
from .models.university import Universities

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


def load_universities_json():
    with open("/app/data/CanadianUniversities.json", "r") as file:
        universities_data = json.load(file)

    with Session(engine) as session:
        for uni in universities_data:
            university = Universities(name=uni["name"], domains=uni["domains"])
            session.add(university)
        session.commit()