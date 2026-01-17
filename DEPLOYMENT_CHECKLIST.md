# 🚀 DEPLOYMENT CHECKLIST

## PHASE 1: Prepare for Deployment ✅

### Local Testing
- [ ] Run `npm run dev` in frontend - works
- [ ] Run `python -m uvicorn app.main:app --reload` in backend - works
- [ ] Test email sending locally
- [ ] Test AI generation locally
- [ ] Test credentials saving locally

### Code Cleanup
- [ ] Remove all console.log statements (optional, but clean)
- [ ] Check for TODO/FIXME comments
- [ ] Verify no hardcoded URLs (use env vars)
- [ ] Update .gitignore to exclude .env

### Git Setup
- [ ] Create GitHub repository
- [ ] Commit all files: `git add . && git commit -m "Initial commit"`
- [ ] Push to GitHub: `git push -u origin main`

---

## PHASE 2: Set Up Infrastructure (External Services)

### Supabase (Database) - 10 minutes
- [ ] Create Supabase account (https://supabase.com)
- [ ] Create new project
- [ ] Create SQL tables using provided schema
- [ ] Get DATABASE_URL connection string
- [ ] Test connection works

### Vercel (Frontend) - 10 minutes
- [ ] Create Vercel account (https://vercel.com)
- [ ] Import GitHub repository
- [ ] Select `frontend` directory as root
- [ ] Add VITE_API_URL environment variable
- [ ] Deploy and note the URL

### Render (Backend) - 10 minutes
- [ ] Create Render account (https://render.com)
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Select `backend` directory as root
- [ ] Add all 5 environment variables:
  - [ ] GEMINI_API_KEY
  - [ ] EMAIL_USER
  - [ ] EMAIL_PASSWORD
  - [ ] DATABASE_URL
  - [ ] FRONTEND_URL (from Vercel)
- [ ] Deploy and note the URL

---

## PHASE 3: Post-Deployment Testing

### Backend API Tests
- [ ] Health check: `curl https://your-backend.onrender.com/api/v1/health`
- [ ] Config endpoint: `curl https://your-backend.onrender.com/api/v1/config/credentials`

### Frontend Tests
- [ ] Load website: https://your-frontend.vercel.app
- [ ] Setup page loads
- [ ] Can enter credentials
- [ ] Test Connection button works
- [ ] Save Credentials button works

### Functional Tests
- [ ] Generate email works
- [ ] Send email works (test with your own email)
- [ ] Upload resume works
- [ ] Campaign history saves

### Performance Check
- [ ] First load takes <30 seconds (cold start - normal)
- [ ] Second load takes <5 seconds
- [ ] No CORS errors in browser console
- [ ] No 502 errors in API responses

---

## PHASE 4: Optimization (Optional)

### Keep Backend Warm
- [ ] Create UptimeRobot account (https://uptimerobot.com)
- [ ] Add monitor: `https://your-backend.onrender.com/api/v1/health`
- [ ] Set interval to 5 minutes
- [ ] Backend now stays warm (no cold starts)

### Monitor Errors
- [ ] Set up error notifications in Render
- [ ] Check Render logs regularly
- [ ] Check Vercel deployment logs

---

## PHASE 5: Production Hardening

### Security
- [ ] Verify .env is in .gitignore
- [ ] Verify no secrets in code/comments
- [ ] Set DEBUG=False in production
- [ ] Use app passwords (not account passwords)

### Database
- [ ] Enable Supabase backups
- [ ] Test database restore process
- [ ] Monitor storage usage (free tier: 5MB)

### Monitoring
- [ ] Set up error alerts
- [ ] Monitor request logs
- [ ] Check monthly usage vs free tier limits

---

## ENVIRONMENT VARIABLES NEEDED

Copy this checklist and fill in:

```
GEMINI_API_KEY = ___________________
EMAIL_USER = ______________________
EMAIL_PASSWORD = __________________
DATABASE_URL = _____________________
FRONTEND_URL = https://your-frontend.vercel.app
```

---

## QUICK REFERENCE URLs

After deployment, save these URLs:

```
Frontend: https://_____________________.vercel.app
Backend:  https://_____________________.onrender.com
Database: Supabase (https://supabase.com)
```

---

## TROUBLESHOOTING COMMANDS

If something goes wrong:

```bash
# Test backend health
curl https://your-backend.onrender.com/api/v1/health

# View Render logs
# Go to: https://dashboard.render.com

# View Vercel logs
# Go to: https://vercel.com/dashboard

# Rebuild frontend
git push origin main  # Auto-redeploys on Vercel

# Restart backend
# Go to Render dashboard, click "Manual Deploy"
```

---

## COST SUMMARY

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel | Unlimited | $0 |
| Render | 750 hrs/month | $0 |
| Supabase | 5MB storage | $0 |
| **TOTAL** | | **$0/month** ✅ |

---

## SUCCESS CRITERIA

You're done when:
- ✅ Frontend loads at Vercel URL
- ✅ Backend responds to requests
- ✅ Emails send successfully
- ✅ AI generates emails correctly
- ✅ Credentials persist after saving
- ✅ No 502 or CORS errors

**Congratulations! Your app is live! 🎉**
