import asyncio
from fastapi import FastAPI
from app.api.v1.api import api_router
from app.services.reply_service import ReplyCheckerService
from app.core.config import settings
from app.core.database import create_tables
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI HR Automator")

# CORS configuration
cors_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8000",
    "https://my-email-tracker-4or3g7hqo-laxmi-narayans-projects-113826ee.vercel.app/"
]

# Add production URLs if available
if settings.FRONTEND_URL and settings.FRONTEND_URL not in cors_origins:
    cors_origins.append(settings.FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

# Minimal Background Task for Reply Checking
async def reply_checker_worker():
    reply_service = ReplyCheckerService()
    user=settings.EMAIL_USER
    password=settings.EMAIL_PASSWORD
    while True:
        # Industry Practice: In a real app, you'd fetch user_email/pass from DB
        # For bare minimum, we illustrate the loop logic
        replies=reply_service.check_for_replies(user,password, ["researchanalystforapurpose@gmail.com"])
        print("Checking for HR replies...")
        for reply in replies:
            print(reply)
        
        # This is where you would trigger your 'Custom Message' notification 
        # (e.g., via WebSocket or updating a DB flag for the Frontend)
        
        await asyncio.sleep(300) # Check every 5 minutes

@app.on_event("startup")
async def startup_event():
    # Initialize database tables
    create_tables()
    # Start the background task
    # asyncio.create_task(reply_checker_worker())

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
