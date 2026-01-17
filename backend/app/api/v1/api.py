from fastapi import APIRouter
from app.api.v1.endpoints import ai_email, resume, config

api_router = APIRouter()

# Registering the AI and Email routes
api_router.include_router(
    ai_email.router, 
    prefix="/email-tools", 
    tags=["AI & Email"]
)

# Registering the Resume routes
api_router.include_router(
    resume.router,
    tags=["Resumes"]
)

# Registering the Config routes
api_router.include_router(
    config.router,
    tags=["Configuration"]
)