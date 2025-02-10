import requests
import json

def fetchCanadianUniversities():
    url = 'http://universities.hipolabs.com/search?country=canada'

    try: 
        response = requests.get(url)

        if response.status_code == 200:
            allUniversities = response.json()
            return allUniversities
        else:
            raise Exception(f'An error occurred: {response.status_code}')

    except requests.exceptions.RequestException as e:
        print('Error:', e)
        return []

def processUniversities(allUniversities):
    cleanedListOfUniversities = [
        {"name": university["name"], "domains": university["domains"]}
        for university in allUniversities
    ]
    return cleanedListOfUniversities

def saveUniversitiesToJson(cleanedListOfUniversities):
    with open("CanadianUniversities.json", 'w', encoding="utf-8") as file:
        json.dump(cleanedListOfUniversities, file, indent=4, ensure_ascii=False) 

def main():
    universities = fetchCanadianUniversities()
    if universities:  
        cleanedUniversities = processUniversities(universities)
        saveUniversitiesToJson(cleanedUniversities)
        print("Data successfully saved to CanadianUniversities.json")
    else:
        print("No data to save.")

if __name__ == '__main__':
    main()
