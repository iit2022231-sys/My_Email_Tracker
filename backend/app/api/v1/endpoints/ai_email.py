from fastapi import APIRouter, Depends, HTTPException
from app.schemas.email import AIPromptRequest, EmailResponse, BulkEmailRequest
from app.services.ai_service import AIService
from app.services.email_service import EmailService

router = APIRouter()

@router.post("/generate-content", response_model=EmailResponse)
async def generate_ai_email(request: AIPromptRequest, ai_service: AIService = Depends(AIService)):
    content = await ai_service.generate_email(request.prompt, request.context)
    return {"content": content}

@router.post("/send-bulk")
async def send_bulk(request: BulkEmailRequest, email_service: EmailService = Depends(EmailService)):
    try:
        success = email_service.send_bulk_emails(request.hr_emails, request.subject, request.body)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to send emails")
        return {"status": "Success", "sent_to": len(request.hr_emails)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Email sending error: {str(e)}")