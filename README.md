# � Email Tracker - AI-Powered Job Search Email Automation

A full-stack application that automates personalized email outreach for job searching using AI-generated content, email campaign tracking, and resume management.

## 🎯 Overview

**Email Tracker** helps job seekers automate and manage their outreach to HR professionals and recruiters. It uses Google's Gemini AI to generate personalized emails based on templates and context, tracks email campaigns, manages resumes, and provides a unified interface for managing contacts and communications.

### Key Features

- ✉️ **AI-Generated Emails** - Personalized email generation using Google Gemini AI
- 📬 **Bulk Email Sending** - Send emails to multiple contacts simultaneously
- 📋 **Campaign Tracking** - Track email campaigns and their status
- 👥 **Contact Management** - Upload, organize, and manage HR contacts
- 📄 **Resume Management** - Upload and manage multiple resumes
- 🎨 **Email Templates** - Pre-built templates for common outreach scenarios
- 📊 **Email Preview** - Preview and edit emails before sending
- 🔐 **Secure Authentication** - Email authentication with stored credentials
- 🖥️ **Modern UI** - React + Tailwind CSS frontend with responsive design

## 📁 Project Structure

```
Email Tracker/
├── backend/                    # FastAPI Python backend
│   ├── app/
│   │   ├── main.py            # FastAPI app initialization
│   │   ├── main_gui.py        # GUI interface for desktop
│   │   ├── gui.py             # GUI components
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── api.py     # API router
│   │   │       └── endpoints/
│   │   │           ├── ai_email.py    # Email generation endpoints
│   │   │           ├── resume.py      # Resume management endpoints
│   │   │           └── config.py      # Configuration endpoints
│   │   ├── services/
│   │   │   ├── ai_service.py         # Google Gemini AI integration
│   │   │   ├── email_service.py      # SMTP email sending
│   │   │   └── reply_service.py      # Email reply checking
│   │   ├── models/
│   │   │   ├── contact.py            # Contact model
│   │   │   ├── campaign.py           # Campaign model
│   │   │   ├── email_template.py     # Email template model
│   │   │   └── resume.py             # Resume model
│   │   ├── schemas/
│   │   │   ├── email.py              # Email request/response schemas
│   │   │   └── resume.py             # Resume schemas
│   │   ├── core/
│   │   │   ├── config.py             # Configuration & environment
│   │   │   └── database.py           # Database setup
│   │   └── static/                   # Frontend build output
│   ├── requirements.txt              # Python dependencies
│   └── pyproject.toml               # Project metadata
│
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx                  # Main application component
│   │   ├── main.jsx                 # Vite entry point
│   │   ├── index.css                # Global styles + Tailwind
│   │   ├── api/
│   │   │   ├── email_service.js     # Email API client
│   │   │   └── database_service.js  # Database API client
│   │   └── components/
│   │       ├── AIPrompt.jsx         # AI prompt input component
│   │       ├── EmailTemplates.jsx   # Template management
│   │       ├── EmailPreview.jsx     # Email preview
│   │       ├── HRTable.jsx          # Contact list table
│   │       ├── ContactUpload.jsx    # Contact upload
│   │       ├── CampaignHistory.jsx  # Campaign tracking
│   │       ├── ResumesTab.jsx       # Resume management
│   │       ├── SetupPage.jsx        # Initial setup/config
│   │       ├── Toast.jsx            # Notifications
│   │       └── Notification.jsx     # Alert notifications
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md                   # This file
```

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.8+)
- **Database**: SQLAlchemy + SQLite
- **AI**: Google Generative AI (Gemini)
- **Email**: smtplib (SMTP)
- **Server**: Uvicorn
- **Package Manager**: pip

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: React Icons
- **PDF Viewer**: pdfjs-dist

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn
- Google Gemini API key
- Gmail account (for email sending)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Set environment variables
# Create a .env file with:
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
GEMINI_API_KEY=your-google-api-key
DATABASE_URL=sqlite:///./email_tracker.db
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587

# Run the backend
python -m uvicorn app.main:app --reload
```

The backend will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

The frontend will be available at `http://localhost:5173`

## 📖 Core Functionality

### 1. **Email Generation**
- Uses Google Gemini AI to generate personalized emails
- Takes user prompt + context (resume, job description, etc.)
- Returns AI-generated email subject and body
- Endpoint: `POST /api/v1/ai_email/generate`

### 2. **Contact Management**
- CRUD operations for HR contacts
- Store name, email, company, position
- Upload contacts via CSV
- Endpoint: `POST /api/v1/contacts/`

### 3. **Email Sending**
- Bulk send emails to multiple recipients
- SMTP integration with Gmail
- Email templates support
- Endpoint: `POST /api/v1/ai_email/send`

### 4. **Campaign Tracking**
- Track sent email campaigns
- Store campaign metadata (recipients, templates used, timestamps)
- Campaign history and status
- Endpoint: `POST /api/v1/campaigns/`

### 5. **Resume Management**
- Upload and store resumes
- Use resumes as context for email generation
- Support for PDF resumes
- Endpoint: `POST /api/v1/resumes/upload`

### 6. **Reply Checking**
- Background service to check for replies
- Polls email inbox every 5 minutes
- Tracks reply status
- File: `app/services/reply_service.py`

## 🔧 Configuration

### Environment Variables

```env
# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password  # Use Gmail App Password
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587

# AI Configuration
GEMINI_API_KEY=your-google-generativeai-key

# Database
DATABASE_URL=sqlite:///./email_tracker.db

# CORS (Frontend URL)
FRONTEND_URL=http://localhost:5173
```

### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the App Password in `EMAIL_PASSWORD`

## 📚 API Endpoints

### Email Generation
- `POST /api/v1/ai_email/generate` - Generate personalized email

### Email Sending
- `POST /api/v1/ai_email/send` - Send bulk emails

### Contacts
- `GET /api/v1/contacts/` - List all contacts
- `POST /api/v1/contacts/` - Create contact
- `GET /api/v1/contacts/{id}` - Get contact
- `PUT /api/v1/contacts/{id}` - Update contact
- `DELETE /api/v1/contacts/{id}` - Delete contact

### Resumes
- `GET /api/v1/resumes/` - List resumes
- `POST /api/v1/resumes/upload` - Upload resume
- `DELETE /api/v1/resumes/{id}` - Delete resume

### Campaigns
- `GET /api/v1/campaigns/` - List campaigns
- `POST /api/v1/campaigns/` - Create campaign
- `GET /api/v1/campaigns/{id}` - Get campaign details

## 🎨 Frontend Components

| Component | Purpose |
|-----------|---------|
| **AIPrompt** | Input form for email generation prompts |
| **EmailTemplates** | Browse and select email templates |
| **EmailPreview** | Preview and edit generated emails |
| **HRTable** | Display and manage contact list |
| **ContactUpload** | Upload contacts via CSV/Excel |
| **CampaignHistory** | View past campaigns and results |
| **ResumesTab** | Upload and manage resumes |
| **SetupPage** | Initial configuration wizard |
| **Toast** | Toast notifications for user feedback |

## ⚙️ Development

### Running Locally

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Testing

```bash
# Backend tests
cd backend
python test.py

# Frontend development
cd frontend
npm run dev
```

## 📦 Dependencies

### Backend (Python)
- `fastapi==0.109.0` - Web framework
- `uvicorn[standard]==0.27.0` - ASGI server
- `sqlalchemy==2.0.23` - ORM
- `google-generativeai` - AI integration
- `imapclient==3.0.1` - Email checking
- `pydantic-settings==2.1.0` - Configuration management

### Frontend (Node.js)
- `react@18.2.0` - UI framework
- `vite@5.0.0` - Build tool
- `tailwindcss@3.3.0` - CSS framework
- `axios@1.6.0` - HTTP client
- `pdfjs-dist@4.0.0` - PDF rendering

## 🔒 Security Considerations

- Never commit `.env` files with real credentials
- Use Gmail App Passwords instead of account password
- Store sensitive data in environment variables
- CORS configured for localhost development only
- Implement rate limiting for production
- Validate all user inputs

## 🐛 Troubleshooting

### "Gmail login failed"
- Verify email and password are correct
- Check if 2FA is enabled - use App Password
- Verify SMTP credentials in `.env`

### "API not responding"
- Ensure backend is running on port 8000
- Check CORS settings in `app/main.py`
- Verify frontend URL matches CORS origin

### "Gemini API errors"
- Verify API key is valid
- Check API quotas at Google Cloud Console
- Ensure API is enabled for your project

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📧 Contact & Support

For questions or support, please open an issue in the repository.
   ```
   Contains:
   ✓ Application structure
   ✓ UI layouts (desktop/mobile)
   ✓ User journey
   ✓ Color scheme
   ✓ Animations
   ✓ Component hierarchy
   ✓ Data flow diagrams
   ```

### 7. **COMPLETION_CHECKLIST.md** ✅ BUILD STATUS
   - **What**: Complete checklist of everything
   - **Who**: Project managers & reviewers
   - **When**: Verifying completeness
   - **Why**: Ensure nothing is missed
   ```
   Contains:
   ✓ Feature checklist
   ✓ Component status
   ✓ File changes
   ✓ Quality metrics
   ✓ Next steps
   ```

### 8. **FILE_STRUCTURE.md** 📁 FILE INVENTORY
   - **What**: Complete file listing & organization
   - **Who**: Developers managing files
   - **When**: Understanding file organization
   - **Why**: Know where everything is
   ```
   Contains:
   ✓ Directory structure
   ✓ File summary
   ✓ Code statistics
   ✓ Feature mapping
   ✓ Dependency tree
   ```

---

## 🗺️ Navigation Guide

### By Role

**🎨 Designer**
1. VISUAL_OVERVIEW.md - UI/UX guide
2. FRONTEND_BUILD_SUMMARY.md - Design details
3. frontend/README.md - Features

**👨‍💻 Frontend Developer**
1. QUICK_START.md - Get running
2. frontend/README.md - API & features
3. FRONTEND_BUILD_SUMMARY.md - Architecture
4. FILE_STRUCTURE.md - File organization

**🔧 Backend Developer**
1. SETUP.md - Installation
2. frontend/README.md - API endpoints
3. QUICK_START.md - Testing

**📋 Project Manager**
1. BUILD_COMPLETE.md - Overview
2. COMPLETION_CHECKLIST.md - Status
3. SETUP.md - Timeline

**🚀 DevOps/Deployment**
1. SETUP.md - Deployment section
2. frontend/README.md - Build commands
3. FILE_STRUCTURE.md - Production files

### By Goal

**Goal: Get Running Fast**
```
1. BUILD_COMPLETE.md (2 min)
2. QUICK_START.md (5 min)
3. Open app (1 min)
Total: 8 minutes
```

**Goal: Understand Architecture**
```
1. BUILD_COMPLETE.md (5 min)
2. VISUAL_OVERVIEW.md (10 min)
3. FILE_STRUCTURE.md (5 min)
Total: 20 minutes
```

**Goal: Full Setup from Scratch**
```
1. SETUP.md (30 min - follow steps)
2. QUICK_START.md (5 min - verify)
3. Test app (10 min)
Total: 45 minutes
```

**Goal: Deploy to Production**
```
1. SETUP.md (Deployment section - 15 min)
2. frontend/README.md (Build commands - 5 min)
3. Execute deployment (30+ min depending on platform)
Total: 50+ minutes
```

---

## 🔍 Quick Reference

### Common Questions

**Q: Where do I start?**
A: Read BUILD_COMPLETE.md first!

**Q: How do I get it running?**
A: Follow QUICK_START.md (5 minutes)

**Q: What features are included?**
A: See FRONTEND_BUILD_SUMMARY.md

**Q: Where are the components?**
A: See FILE_STRUCTURE.md

**Q: How do I deploy?**
A: See SETUP.md → Deployment section

**Q: What's the API?**
A: See frontend/README.md → API Integration

**Q: Something's not working**
A: See SETUP.md → Troubleshooting

**Q: What files changed?**
A: See FILE_STRUCTURE.md

---

## 📊 Documentation Stats

```
Total Documentation:  1,500+ lines
Files:                8 docs + README
Setup Guide:          200+ lines
Quick Start:          200+ lines
Visual Guide:         300+ lines
Feature Overview:     200+ lines
Checklist:           200+ lines
File Inventory:      200+ lines
```

---

## ⚡ 30-Second Overview

You now have a **professional Email Bulk Sender** with:
- ✨ Beautiful React UI
- 🚀 Fast Vite build
- 🎨 Tailwind CSS styling
- 🤖 AI email generation
- 📧 Bulk email sending
- 📊 Campaign tracking
- 📱 Mobile responsive
- 📚 Complete documentation

---

## 🎯 Next Actions

### Immediate (5 mins)
- [ ] Read BUILD_COMPLETE.md
- [ ] Skim QUICK_START.md

### Short-term (30 mins)
- [ ] Follow SETUP.md
- [ ] Get app running locally
- [ ] Test with sample data

### Medium-term (1-2 hours)
- [ ] Read all documentation
- [ ] Customize for your needs
- [ ] Set up API keys

### Long-term
- [ ] Deploy to production
- [ ] Add custom features
- [ ] Scale as needed

---

## 🚀 Deployment Checklist

Before deploying, ensure you've:
- [ ] Read SETUP.md (Deployment section)
- [ ] Set up environment variables
- [ ] Tested locally
- [ ] Built frontend: `npm run build`
- [ ] Verified backend working
- [ ] Configured CORS
- [ ] Secured API keys
- [ ] Tested email sending

---

## 💬 Documentation Language

### Terms Explained

**Component** - Reusable React element
**Hook** - React state management function
**API** - Backend communication endpoint
**localStorage** - Browser data persistence
**Tailwind** - CSS utility framework
**Vite** - Frontend build tool
**FastAPI** - Python backend framework
**SMTP** - Email sending protocol
**IMAP** - Email receiving protocol

---

## 📞 Support Matrix

| Issue | Resource | Time |
|-------|----------|------|
| Can't install | SETUP.md | 10 min |
| App won't start | QUICK_START.md | 5 min |
| Can't understand code | VISUAL_OVERVIEW.md | 15 min |
| Need API info | frontend/README.md | 5 min |
| Want to know what's built | FRONTEND_BUILD_SUMMARY.md | 10 min |
| Need file locations | FILE_STRUCTURE.md | 5 min |
| Email not sending | SETUP.md Troubleshooting | 10 min |
| Checking completion | COMPLETION_CHECKLIST.md | 5 min |

---

## 🎓 Learning Path

### Beginner Path (1 hour)
1. BUILD_COMPLETE.md (10 min)
2. QUICK_START.md (15 min)
3. Get app running (20 min)
4. Try features (15 min)

### Intermediate Path (2 hours)
1. All of Beginner path
2. FRONTEND_BUILD_SUMMARY.md (20 min)
3. VISUAL_OVERVIEW.md (20 min)
4. Customize something (20 min)

### Advanced Path (4+ hours)
1. All of Intermediate path
2. SETUP.md (30 min)
3. FILE_STRUCTURE.md (15 min)
4. Review all code (1+ hour)
5. Deploy locally (30 min)

---

## 🌟 Documentation Highlights

### Most Important Files (Read First)
1. **BUILD_COMPLETE.md** - Everything overview
2. **QUICK_START.md** - Get running fast
3. **frontend/README.md** - Features & API

### Most Useful Files (Reference Often)
1. **SETUP.md** - Troubleshooting section
2. **FILE_STRUCTURE.md** - File locations
3. **frontend/README.md** - API reference

### Most Fun Files (To Understand)
1. **VISUAL_OVERVIEW.md** - Architecture diagrams
2. **COMPLETION_CHECKLIST.md** - Status overview
3. **FRONTEND_BUILD_SUMMARY.md** - Feature details

---

## ✅ Verification Checklist

After reading docs, verify:
- [ ] Understand what was built
- [ ] Know where files are located
- [ ] Can explain the architecture
- [ ] Know how to get app running
- [ ] Understand features
- [ ] Know where to find API docs
- [ ] Can identify components
- [ ] Ready to deploy

---

## 🎉 You're Ready!

### You Now Know:
✅ What the app does
✅ How it's structured
✅ Where everything is
✅ How to get it running
✅ How to use the features
✅ How to deploy it
✅ Where to find help
✅ How to troubleshoot

---

## 🚀 Start Here → BUILD_COMPLETE.md

Then proceed based on your needs:
- **Want to run it?** → QUICK_START.md
- **Need setup help?** → SETUP.md
- **Want to understand it?** → VISUAL_OVERVIEW.md
- **Need API info?** → frontend/README.md
- **Need file info?** → FILE_STRUCTURE.md

---

**Everything you need is documented!** 📚

**Start with BUILD_COMPLETE.md → QUICK_START.md → Running! 🚀**

---

*Happy coding! Questions? Check the docs!* ✨
