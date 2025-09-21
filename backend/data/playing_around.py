

import pandas as pd
def load_csv_data():
    csv_file = "ConcordiaResponses.csv"
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
    
    # The unique locations in the dataset are:
    #     ['Montreal' 'Mirabel' 'West Island' 'New York City' 'Vancouver' 'Bay Area'
    #  'St-Laurent' 'St-Bruno' 'toronto' 'San Francisco' 'San Jose'
    #  'Vaudreuil Dorion' 'Ottawa' 'Sorel-Tracy' 'Toronto' 'Remote' 'Dorval'
    #  'South Shore' 'Waterloo' 'Seattle' 'Laval' 'remote' 'Saint hubert'
    #  'Brossard' 'Québec' 'Québec ' 'Amos' 'Halifax' 'St-Hubert' 'Boisbriand '
    #  'Contrecoeur' 'Quebec City' 'Quebec']
    # need to map them to include the province
    # also need to map then to cleanup the duplicates of different cases e.g. remote, Remote
    # also need to remove leading and trailing spaces
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
    print(df["location"].unique())

# load_csv_data()
