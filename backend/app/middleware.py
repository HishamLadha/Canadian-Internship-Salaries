from fastapi.middleware.cors import CORSMiddleware
from .config import FRONTEND_URL

def setup_middleware(app):
    app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    )