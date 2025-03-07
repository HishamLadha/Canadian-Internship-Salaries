# Configuration settings 
import os 
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
FRONTEND_URL = os.getenv("FRONTEND_URL")
correct_username = os.getenv("ADMIN_USERNAME")
correct_password = os.getenv("ADMIN_PASSWORD")