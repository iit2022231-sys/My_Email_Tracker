from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import smtplib
import os
from pathlib import Path
from app.core.config import get_settings, reload_settings

router = APIRouter()

class CredentialsModel(BaseModel):
    gemini_api_key: str
    smtp_server: str
    smtp_port: int
    email_user: str
    email_password: str

def get_env_file_path():
    """Get .env file path."""
    backend_dir = Path(__file__).resolve().parent.parent.parent.parent.parent
    return backend_dir / ".env"

def save_to_env_file(credentials: dict) -> None:
    """Save credentials to .env file."""
    env_file = get_env_file_path()
    env_content = f"""GEMINI_API_KEY={credentials['gemini_api_key']}
SMTP_SERVER={credentials['smtp_server']}
SMTP_PORT={credentials['smtp_port']}
EMAIL_USER={credentials['email_user']}
EMAIL_PASSWORD={credentials['email_password']}
DATABASE_URL=sqlite:///./email_tracker.db
DEBUG=True
"""
    try:
        with open(env_file, 'w') as f:
            f.write(env_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save to .env: {str(e)}")

@router.get("/config/credentials")
async def get_credentials():
    """Get current credentials (passwords masked for security)."""
    settings = get_settings()
    return {
        'gemini_api_key': '***' if settings.GEMINI_API_KEY else '',
        'smtp_server': settings.SMTP_SERVER,
        'smtp_port': settings.SMTP_PORT,
        'email_user': settings.EMAIL_USER if settings.EMAIL_USER else '',
        'email_password': '***' if settings.EMAIL_PASSWORD else ''
    }

@router.post("/config/credentials")
async def update_credentials(credentials: CredentialsModel):
    """Update and save credentials."""
    try:
        creds_dict = {
            'gemini_api_key': credentials.gemini_api_key,
            'smtp_server': credentials.smtp_server,
            'smtp_port': credentials.smtp_port,
            'email_user': credentials.email_user,
            'email_password': credentials.email_password
        }
        
        save_to_env_file(creds_dict)
        
        os.environ['GEMINI_API_KEY'] = credentials.gemini_api_key
        os.environ['SMTP_SERVER'] = credentials.smtp_server
        os.environ['SMTP_PORT'] = str(credentials.smtp_port)
        os.environ['EMAIL_USER'] = credentials.email_user
        os.environ['EMAIL_PASSWORD'] = credentials.email_password
        
        reload_settings()
        
        return {"message": "Credentials saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/config/test-connection")
async def test_connection(credentials: CredentialsModel):
    """Test SMTP connection."""
    try:
        server = smtplib.SMTP(credentials.smtp_server, credentials.smtp_port, timeout=5)
        server.starttls()
        server.login(credentials.email_user, credentials.email_password)
        server.quit()
        
        return {"message": "SMTP connection successful!"}
    except smtplib.SMTPAuthenticationError:
        raise HTTPException(status_code=400, detail="Authentication failed. Check your email and password.")
    except smtplib.SMTPException as e:
        raise HTTPException(status_code=400, detail=f"SMTP error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Connection failed: {str(e)}")
