from fastapi import FastAPI
from pydantic import BaseModel
from sqlmodel import Field, SQLModel, create_engine, Session
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

# create a model instance, basically a specific row value
def create_test_salaries():
    test_1 = ReportedSalary(company="ABC Test", year="1999", salary="10000", university="Concordia University", term="3", location="Montreal", bonus="0")

    # create the session which takes and uses the engine provided as a parameter
    # session = Session(engine)

    # using the with block automatically creates and closes the session
    with Session(engine) as session:
        # add the instance to the session, currently still in memory
        session.add(test_1)
        # save to database now
        session.commit()

    # close the session
    # session.close()

# Create main function for code organization
def main():
    create_db_and_tables()
    create_test_salaries()

# this is to creat the database and tables when we run the file with "python3 main.py"
# the internal variable __name__ in your file, created automatically by Python, will have as value the string "__main__".
if __name__ == "__main__":
    main()



app = FastAPI()

# Pydantic model for the request body
class PostRequest(BaseModel):
    name: str
    address: str

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/test")
def read_test():
    return {"helloooooo"}

@app.post("/posting")
def post_test(request: PostRequest):
    return {
        "message": "Received successfully",
        "data": {
            "name": request.name,
            "address": request.address
        },
    }