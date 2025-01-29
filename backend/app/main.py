from fastapi import FastAPI
from pydantic import BaseModel
from sqlmodel import Field, SQLModel, create_engine
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



# create the engine to talk to the database
engine = create_engine(DATABASE_URL, echo=True)

SQLModel.metadata.create_all(engine)



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