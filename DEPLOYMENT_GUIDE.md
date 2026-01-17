# 🚀 FREE DEPLOYMENT GUIDE - Email Tracker

## 📊 Recommended Stack (100% FREE)

```
├── Frontend:   Vercel (React/Vite)         FREE ✅
├── Backend:    Render (FastAPI)            FREE (750 hrs/month) ✅
├── Database:   Supabase (PostgreSQL)       FREE (5MB) ✅
└── Total Cost: $0/month                    ✅
```

---

## 📋 STEP 1: Prerequisites Setup (5 mins)

### Create GitHub Repository
```bash
git init
git add .
git commit -m "Initial commit: Email Tracker"
git remote add origin https://github.com/YOUR_USERNAME/email-tracker.git
git push -u origin main
```

### Create Accounts (Free)
1. **Vercel**: https://vercel.com (sign up with GitHub)
2. **Render**: https://render.com (sign up with GitHub)
3. **Supabase**: https://supabase.com (sign up with GitHub)

---

## 🗄️ STEP 2: Database Setup - Supabase (10 mins)

### Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Select your organization
4. Set project name: `email-tracker`
5. Set password (save it!)
6. Region: Choose closest to you
7. Click "Create new project" and wait...

### Get Database Connection String

1. In Supabase dashboard, go to **Settings → Database**
2. Copy "Connection string" (URI format)
3. It looks like: `postgresql://user:password@host:5432/postgres`

### Create Tables

1. Go to **SQL Editor** tab
2. Paste this SQL:

```sql
-- Create Resumes table
CREATE TABLE IF NOT EXISTS resumes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Contacts table (for future use)
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    company VARCHAR(255),
    position VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create Campaigns table (for future use)
CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    recipients TEXT NOT NULL,
    template_id INT,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);
```

3. Click "Run"

---

## 🔧 STEP 3: Backend Preparation (15 mins)

### Update requirements.txt

Add PostgreSQL driver:

```bash
cd backend
pip install psycopg2-binary gunicorn
```

### Update requirements.txt

```txt
# Web Framework
fastapi==0.109.0
uvicorn[standard]==0.27.0
gunicorn==21.2.0

# Environment & Schemas
pydantic-settings==2.1.0
email-validator==2.1.0.post1

# Database
sqlalchemy==2.0.23
alembic==1.13.1
psycopg2-binary==2.9.9

# AI Integration
google-generativeai

# Email & Networking
imapclient==3.0.1
python-multipart==0.0.6
```

### Create Procfile

Create `backend/Procfile`:

```
web: gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

### Create Runtime File

Create `backend/runtime.txt`:

```
python-3.10.13
```

### Update Config for PostgreSQL

Update `backend/app/core/config.py`:

```python
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
    # Use PostgreSQL for production
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./email_tracker.db"
    )
    
    # App Configuration
    DEBUG: bool = False
    
    # CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

def reload_settings():
    """Reload settings from environment variables."""
    global settings
    settings = Settings()
    return settings

def get_settings():
    """Get current settings."""
    return settings
```

### Update CORS in main.py

Update `backend/app/main.py` to accept production URLs:

```python
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        settings.FRONTEND_URL,  # Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
```

---

## 🎨 STEP 4: Frontend Preparation (10 mins)

### Create .env.production

Create `frontend/.env.production`:

```
VITE_API_URL=https://your-render-app.onrender.com/api/v1
```

### Update vite.config.js

Ensure it uses environment variables:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL)
  }
})
```

### Build Frontend Locally (Test)

```bash
cd frontend
npm run build
```

Should create `frontend/dist/` folder without errors.

---

## 📤 STEP 5: Deploy Backend to Render (15 mins)

### Step 1: Connect GitHub

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select your repo and authorize

### Step 2: Configure Service

| Setting | Value |
|---------|-------|
| **Name** | `email-tracker-api` |
| **Environment** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app` |
| **Root Directory** | `backend` |
| **Branch** | `main` |

### Step 3: Add Environment Variables

In Render dashboard, go to **Environment**:

```
GEMINI_API_KEY=your-api-key-here
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
DATABASE_URL=postgresql://user:password@host:5432/postgres
FRONTEND_URL=https://your-vercel-app.vercel.app
DEBUG=False
```

### Step 4: Deploy

Click "Create Web Service" and wait ~5 minutes for deployment.

**Copy your Render URL**: It will look like `https://email-tracker-api.onrender.com`

---

## 🌐 STEP 6: Deploy Frontend to Vercel (10 mins)

### Step 1: Connect GitHub

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Vercel auto-detects it's a Monorepo

### Step 2: Configure Project

| Setting | Value |
|---------|-------|
| **Framework** | `Vite` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### Step 3: Environment Variables

In Vercel, go to **Settings → Environment Variables**:

```
VITE_API_URL=https://email-tracker-api.onrender.com/api/v1
```

### Step 4: Deploy

Click "Deploy" and wait ~2 minutes.

**Your frontend is live!** Vercel will give you a URL like `https://email-tracker.vercel.app`

---

## ✅ STEP 7: Testing Deployment (10 mins)

### Test Backend API

```bash
curl https://email-tracker-api.onrender.com/api/v1/config/credentials
```

Should return credentials response (masked).

### Test Frontend

1. Visit `https://email-tracker.vercel.app`
2. Go to Setup page
3. Enter your credentials:
   - Gmail email
   - Gmail app password
   - Google Gemini API key
   - SMTP settings

4. Click "Test Connection" → Should pass ✅
5. Click "Save Credentials" → Should save ✅

### Test AI Generation

1. Go to Compose tab
2. Enter a prompt
3. Click "Generate Email" → Should generate ✅

### Test Email Sending

1. Add contacts
2. Select contacts
3. Generate email
4. Click "Send Emails" → Should send ✅

---

## 🔒 Environment Variables Checklist

You need these 5 variables for full functionality:

| Variable | Where to Get | Example |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Cloud Console | `AIza...` |
| `EMAIL_USER` | Your Gmail address | `yourname@gmail.com` |
| `EMAIL_PASSWORD` | Gmail App Password | `xxxx xxxx xxxx xxxx` |
| `DATABASE_URL` | Supabase settings | `postgresql://...` |
| `FRONTEND_URL` | Your Vercel URL | `https://email-tracker.vercel.app` |

---

## 🎯 Post-Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Database created on Supabase
- [ ] Environment variables set correctly
- [ ] CORS configured for Vercel URL
- [ ] Tested email sending
- [ ] Tested AI generation
- [ ] Verified credentials saving
- [ ] Backend cold start takes 30-50 seconds (normal)
- [ ] Checked Render logs for errors

---

## 💡 Production Optimizations

### Cold Start Issues

On Render free tier:
- First request takes 30-50 seconds (cold start)
- Subsequent requests are fast
- Solution: Use a free uptime monitor to keep it warm

### Keep Backend Warm

Use free uptime monitor like **UptimeRobot**:

1. Go to https://uptimerobot.com
2. Create free account
3. Add monitor: `https://email-tracker-api.onrender.com/api/v1/config/credentials`
4. Set check interval to 5 minutes
5. Backend stays warm! ✅

### Database Backups

Supabase automatically backs up free tier databases.

---

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Database connection failed" | Check DATABASE_URL format and Supabase is running |
| "CORS error" | Verify FRONTEND_URL in environment variables |
| "Email not sending" | Check Gmail app password (not account password) |
| "AI not generating" | Verify GEMINI_API_KEY is valid and has quota |
| "Backend 502 error" | Check Render logs - might be Python version mismatch |
| "Frontend shows blank page" | Check VITE_API_URL in Vercel environment |

---

## 📊 Free Tier Limits

| Service | Limit | Status |
|---------|-------|--------|
| **Vercel** | Unlimited builds, requests | ✅ Plenty |
| **Render** | 750 hours/month (~31 days/month) | ✅ Enough |
| **Supabase** | 5MB database storage | ⚠️ May need upgrade for many resumes |

---

## 🔄 Continuous Deployment

Both Vercel and Render auto-deploy when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Fix: xyz"
git push origin main

# Vercel/Render automatically deploys! ✅
```

---

## 📞 Support & Next Steps

### If Something Goes Wrong

1. **Check Render logs**: Dashboard → Your App → Logs
2. **Check Vercel logs**: Dashboard → Your Project → Deployments
3. **Test locally first**: `npm run dev` and `python -m uvicorn app.main:app --reload`

### Upgrade Path (When Needed)

- **Render**: Upgrade from free to paid ($7+/month)
- **Vercel**: Always free for hobby projects
- **Supabase**: Upgrade to 1GB ($25/month) when needed

---

## ✨ You're Done! 🎉

Your Email Tracker is now live for FREE:

- **Frontend**: https://email-tracker.vercel.app
- **Backend**: https://email-tracker-api.onrender.com
- **Database**: Supabase (PostgreSQL)

All for **$0/month**! 🚀
