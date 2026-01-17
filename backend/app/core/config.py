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
    DATABASE_URL: str = "sqlite:///./email_tracker.db"
    
    # App Configuration
    DEBUG: bool = True

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