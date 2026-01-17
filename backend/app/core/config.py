from pydantic_settings import BaseSettings
import os
from pathlib import Path

class Settings(BaseSettings):
    # API Keys
    GEMINI_API_KEY: str = ""
    
    # Email Configuration
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    EMAIL_USER: str = ""
    EMAIL_PASSWORD: str = ""
    
    # Database Configuration
    # Use PostgreSQL for production, SQLite for development
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./email_tracker.db"
    )
    
    # Frontend URL for CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "")
    
    # App Configuration
    DEBUG: bool = False
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create initial settings instance
settings = Settings()

def reload_settings():
    """Reload settings from environment variables."""
    global settings
    settings = Settings()
    return settings

def get_settings():
    """Get current settings."""
    return settings