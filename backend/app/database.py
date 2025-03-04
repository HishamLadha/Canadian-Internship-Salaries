# Database configuration and setup
from sqlmodel import SQLModel, create_engine, Session
from .config import DATABASE_URL

connect_args = {"check_same_thread": False}

# create the engine to talk to the database
engine = create_engine(DATABASE_URL, echo=True) #echo = false makes it not print out to the console

# create the database and tables wrapped in a function to prevent side effects
# for example, if database.py is imported in another file, we don't want it to create the database 
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
        

