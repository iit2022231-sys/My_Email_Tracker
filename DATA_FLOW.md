# 📊 Email Tracker - Complete Data Flow Documentation

## 🔄 Data Flow Architecture

This document traces how data flows through each feature of the Email Tracker application.

---

## 1️⃣ CREDENTIALS MANAGEMENT FLOW

### **Frontend → Backend Journey**

```
User enters credentials in SetupPage
    ↓
Frontend: POST /config/credentials with {gemini_api_key, email_user, email_password, ...}
    ↓
Backend: config.py endpoint receives CredentialsModel
    ↓
Backend: save_to_env_file() → Writes to backend/.env file
    ↓
Backend: os.environ update → Updates runtime environment
    ↓
Backend: reload_settings() → Reloads global settings object
    ↓
Settings are now available to all services
```

### **Key Files Involved**
- Frontend: `src/components/SetupPage.jsx` → calls `configService.testConnection()`
- Backend: `backend/app/api/v1/endpoints/config.py`
- Config: `backend/app/core/config.py` (with `reload_settings()` function)

### **Why it works now**
- ✅ Credentials are saved to `.env` file (persistent across restarts)
- ✅ `reload_settings()` updates the global settings object
- ✅ All services use `get_settings()` to fetch current credentials

---

## 2️⃣ AI EMAIL GENERATION FLOW

### **Frontend → Backend Journey**

```
User enters prompt in AIPrompt component
    ↓
User clicks "Generate Email"
    ↓
Frontend: POST /email-tools/generate-content 
    {prompt: "...", context: "..."}
    ↓
Backend: ai_email.py endpoint receives AIPromptRequest
    ↓
Backend: Creates AIService instance
    AIService.__init__():
        - Calls get_settings()
        - Uses settings.GEMINI_API_KEY to configure genai
    ↓
Backend: Calls ai_service.generate_email(prompt, context)
    ↓
Google Gemini API generates response
    ↓
Response returned to Frontend
    ↓
Frontend: processEmailContent() parses response
    ↓
User sees generated email preview
```

### **Key Files Involved**
- Frontend: `src/components/AIPrompt.jsx` → calls `emailService.generateDraft()`
- Backend: `backend/app/api/v1/endpoints/ai_email.py` → `generate_ai_email()`
- Service: `backend/app/services/ai_service.py`
- Config: `backend/app/core/config.py` → provides GEMINI_API_KEY

### **Data Structure**

**Request**:
```json
{
  "prompt": "Write an email to HR at TechCorp",
  "context": "I am a software engineer interested in their position"
}
```

**Response**:
```json
{
  "content": "Subject: Application for Software Engineer Position\n\nDear Hiring Team,..."
}
```

---

## 3️⃣ BULK EMAIL SENDING FLOW

### **Frontend → Backend Journey**

```
User selects contacts
    ↓
User views generated email
    ↓
User clicks "Send Emails"
    ↓
Frontend: validate emails with emailService.validateEmails()
    (Local validation before sending)
    ↓
Frontend: POST /email-tools/send-bulk
    {
      hr_emails: ["alice@company.com", "bob@company.com"],
      subject: "Subject line",
      body: "Email body content"
    }
    ↓
Backend: ai_email.py endpoint receives BulkEmailRequest
    ↓
Backend: Creates EmailService instance
    EmailService.__init__():
        - Calls get_settings()
        - Gets EMAIL_USER, EMAIL_PASSWORD, SMTP_SERVER, SMTP_PORT
        - Stores them as instance variables
    ↓
Backend: Calls email_service.send_bulk_emails()
    ↓
For each recipient:
    - Connect to SMTP server (Gmail)
    - Create MIME message
    - Send message
    - Handle individual failures gracefully
    ↓
Return: {status: "Success", sent_to: X}
    ↓
Frontend: Show success toast notification
    ↓
Campaign is saved to localStorage
```

### **Key Files Involved**
- Frontend: `src/App.jsx` → `handleSend()` function
- Backend: `backend/app/api/v1/endpoints/ai_email.py` → `send_bulk()`
- Service: `backend/app/services/email_service.py` → `send_bulk_emails()`
- Config: `backend/app/core/config.py` → provides SMTP credentials

### **Data Structure**

**Request**:
```json
{
  "hr_emails": ["alice@techcorp.com", "bob@techcorp.com"],
  "subject": "Application for Software Engineer",
  "body": "Dear Hiring Team,\n\nI am interested in..."
}
```

**Response** (Success):
```json
{
  "status": "Success",
  "sent_to": 2
}
```

**Response** (Error):
```json
{
  "detail": "Email sending error: Email credentials not configured..."
}
```

---

## 4️⃣ RESUME MANAGEMENT FLOW

### **Frontend → Backend Journey**

```
User uploads resume in ResumesTab
    ↓
Frontend: POST /resumes
    {name: "Resume_V1", content: "..."}
    ↓
Backend: resume.py endpoint receives ResumeCreate
    ↓
Backend: Check if resume name already exists
    ↓
Backend: Create Resume in database
    db.add(db_resume)
    db.commit()
    ↓
Backend: Return ResumeResponse with id
    ↓
Frontend: Update resumes list
    ↓
User can now select this resume for email context
```

### **Get Resume for Email Context**

```
User selects a resume
    ↓
Frontend: GET /resumes/{resume_id}
    ↓
Backend: Query resume from database
    ↓
Backend: Return full resume content
    ↓
Frontend: Append to email generation context
    ↓
AI generator includes resume in prompt
```

### **Key Files Involved**
- Frontend: `src/components/ResumesTab.jsx` → calls `resumeService.*`
- Backend: `backend/app/api/v1/endpoints/resume.py`
- Database: `backend/app/models/resume.py`
- Utils: `backend/app/core/utils.py` → `BaseRepository`

---

## 5️⃣ CONFIGURATION & SETTINGS FLOW

### **How Settings are Loaded**

```
Application Startup
    ↓
backend/app/core/config.py loads
    ↓
Settings class reads from .env file
    ↓
Global `settings` object created with values:
    - GEMINI_API_KEY
    - SMTP_SERVER
    - SMTP_PORT
    - EMAIL_USER
    - EMAIL_PASSWORD
    ↓
Each service gets_settings() when instantiated
```

### **How Settings are Updated**

```
User clicks "Save Credentials" → POST /config/credentials
    ↓
save_to_env_file() writes to backend/.env
    ↓
os.environ updated with new values
    ↓
reload_settings() called
    ↓
Global settings object recreated from environment
    ↓
Next service instantiation gets new values
```

### **Key Concept: Settings Isolation**

Each service gets its own copy of settings at instantiation time:

```python
# In EmailService.__init__()
settings = get_settings()  # Gets current global settings
self.email_user = settings.EMAIL_USER
self.smtp_server = settings.SMTP_SERVER
```

This way:
- ✅ Services always have the latest credentials
- ✅ Multiple services can run without conflicts
- ✅ Settings changes take effect immediately

---

## 6️⃣ ERROR HANDLING FLOW

### **Frontend Error Handling**

```python
# In apiClient.js
const handleError = (error) => {
  const errorMessage = error?.response?.data?.detail || error?.message;
  console.error('API Error:', errorMessage);
  throw error;  // Re-throw for component handling
};
```

### **Backend Error Handling**

Each endpoint catches errors and returns meaningful messages:

```python
@router.post("/send-bulk")
async def send_bulk(request, email_service):
    try:
        success = email_service.send_bulk_emails(...)
        return {"status": "Success", "sent_to": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Email sending error: {str(e)}")
```

---

## 🔐 Security Considerations

### **Credentials Handling**

| Component | How It Handles Credentials | Security Level |
|-----------|---------------------------|-----------------|
| **Frontend** | Doesn't store plaintext passwords | ✅ Safe |
| **Backend Config** | Stores in environment variables from `.env` | ✅ Safe (if .env not committed) |
| **API Response** | Returns masked passwords (***) | ✅ Safe |
| **SMTP Login** | Credentials only used at runtime | ✅ Safe |

### **Best Practices**

1. **Never commit `.env` file** to Git
2. **Use Gmail App Passwords**, not your actual password
3. **Credentials are only in memory** during runtime
4. **Endpoints validate all inputs** before processing

---

## 📊 Data Models

### **Resume Model**
```
Resume
├── id: int (primary key)
├── name: str (unique, required)
├── content: str (required)
├── created_at: datetime
└── updated_at: datetime
```

### **Credentials Model**
```
CredentialsModel
├── gemini_api_key: str
├── smtp_server: str
├── smtp_port: int
├── email_user: str
└── email_password: str
```

### **Email Model**
```
BulkEmailRequest
├── hr_emails: List[EmailStr]
├── subject: str
└── body: str
```

---

## 🚀 Complete Request/Response Examples

### **Example 1: Generate Email**

**Request**:
```
POST /api/v1/email-tools/generate-content
{
  "prompt": "Write a professional email for a software engineer role",
  "context": "I have 5 years of experience in full-stack development"
}
```

**Response**:
```json
{
  "content": "Subject: Application for Software Engineer Position\n\nDear Hiring Manager,\n\nI am writing to express my strong interest..."
}
```

### **Example 2: Send Bulk Emails**

**Request**:
```
POST /api/v1/email-tools/send-bulk
{
  "hr_emails": ["hr@company1.com", "hr@company2.com"],
  "subject": "Software Engineer Application",
  "body": "Dear Hiring Team,\n\nI am interested in the software engineer position at your company..."
}
```

**Response**:
```json
{
  "status": "Success",
  "sent_to": 2
}
```

### **Example 3: Save Credentials**

**Request**:
```
POST /api/v1/config/credentials
{
  "gemini_api_key": "AIza...",
  "smtp_server": "smtp.gmail.com",
  "smtp_port": 587,
  "email_user": "your-email@gmail.com",
  "email_password": "app-password-here"
}
```

**Response**:
```json
{
  "message": "Credentials saved successfully"
}
```

---

## ✅ Verification Checklist

Use this to verify each flow is working:

### **Credentials Flow**
- [ ] Enter credentials in Setup page
- [ ] Click "Test Connection" → shows success
- [ ] Click "Save Credentials" → shows success
- [ ] Restart backend
- [ ] Email sending should still work (persistent)

### **AI Generation Flow**
- [ ] Enter prompt in AIPrompt
- [ ] Click "Generate" → gets email back
- [ ] Email appears in preview
- [ ] Can edit generated email

### **Email Sending Flow**
- [ ] Select contacts
- [ ] View email
- [ ] Click "Send Emails"
- [ ] See success message
- [ ] Campaign appears in history

### **Resume Management Flow**
- [ ] Upload resume
- [ ] See it in ResumesTab list
- [ ] Select it for email generation
- [ ] Resume content included in AI context

---

## 🛠️ Troubleshooting Guide

| Issue | Cause | Solution |
|-------|-------|----------|
| "Email credentials not configured" | `.env` file missing values | Add SMTP credentials to `.env` and restart |
| "SMTP error: Connection refused" | Wrong SMTP server/port | Use `smtp.gmail.com:587` for Gmail |
| "Authentication failed" | Wrong email/password | Use Gmail App Password, not account password |
| "No credentials saved after restart" | Credentials not persisted | Check `.env` file was written successfully |
| "AI not generating" | GEMINI_API_KEY missing | Add API key to `.env` |

