from pydantic import BaseModel, EmailStr, field_validator
from typing import List, Optional
from app.core.utils import EmailValidator

class AIPromptRequest(BaseModel):
    prompt: str
    context: Optional[str] = "Job application for a software role"

class EmailResponse(BaseModel):
    content: str

class BulkEmailRequest(BaseModel):
    hr_emails: List[EmailStr]
    subject: str
    body: str
    
    @field_validator('hr_emails')
    @classmethod
    def validate_emails(cls, v):
        if not EmailValidator.validate_list(v):
            raise ValueError('One or more invalid email addresses')
        return v

class ReplyNotification(BaseModel):
    hr_email: str
    snippet: str