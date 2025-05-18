from fastapi import FastAPI
from .middleware import setup_middleware
from .data_loader import load_csv_data, load_universities_json
from .routers import salaries, universities, companies, admin, locations
from .database import engine, create_db_and_tables

# initialize the instance 
app = FastAPI()

# Include all the routers
app.include_router(salaries.router)
app.include_router(locations.router)
app.include_router(companies.router)
app.include_router(universities.router)
app.include_router(admin.router)

# Setup middleware
setup_middleware(app)

@app.on_event("startup")
def on_startup(): 
    create_db_and_tables() 
    # load_csv_data() 
    # load_universities_json() 
    
