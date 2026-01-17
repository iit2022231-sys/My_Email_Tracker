# Email Bulk Sender - Frontend

A professional, interactive React + Vite frontend for sending bulk emails with AI-powered content generation.

## 🎯 Features

- **AI Email Generation**: Use Google Generative AI to create personalized emails
- **Contact Management**: Import CSV files with HR contacts
- **Email Templates**: Pre-built templates for common outreach scenarios
- **Bulk Sending**: Send emails to multiple recipients at once
- **Campaign History**: Track all your sent campaigns
- **Email Preview**: See exactly how your email looks before sending
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Local Storage**: Persist campaign history in browser

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── AIPrompt.jsx    # AI email generator interface
│   ├── HRTable.jsx     # Contact table with search & sort
│   ├── EmailTemplates.jsx # Pre-built email templates
│   ├── EmailPreview.jsx  # Email preview panel
│   ├── ContactUpload.jsx # CSV import component
│   ├── CampaignHistory.jsx # Campaign tracking
│   └── Toast.jsx       # Notifications
├── api/
│   └── email_service.js # API communication
├── App.jsx             # Main application component
├── main.jsx            # React entry point
└── index.css           # Tailwind CSS + custom styles

```

## 🔌 API Integration

The frontend communicates with the backend at `http://localhost:8000/api/v1`

### API Endpoints Used:

- **`POST /generate-content`** - Generate email content via AI
  - Request: `{ prompt: string, context: string }`
  - Response: `{ content: string }`

- **`POST /send-bulk`** - Send emails to multiple recipients
  - Request: `{ hr_emails: string[], subject: string, body: string }`
  - Response: `{ status: string, sent_to: number }`

## 🎨 Styling

Uses Tailwind CSS with custom utilities:
- Custom animations (fadeIn, slideUp)
- Glass morphism effects
- Gradient backgrounds
- Responsive grid layouts

## 💾 Data Storage

Campaign data is stored in browser's localStorage and persists across sessions.

## 🔧 Configuration

### Backend URL
Update `API_BASE_URL` in `src/api/email_service.js` if your backend runs on a different URL.

## 📦 Dependencies

- **react**: ^18.2.0 - UI library
- **react-dom**: ^18.2.0 - DOM rendering
- **react-icons**: ^4.12.0 - Icon library
- **axios**: ^1.6.0 - HTTP client
- **tailwindcss**: ^3.3.0 - Utility CSS framework

## 🚀 Deployment

### Using Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Using GitHub Pages
```bash
npm run build
# Deploy the dist folder
```

### Using Traditional Hosting
```bash
npm run build
# Upload the dist folder to your hosting provider
```

## 🐛 Troubleshooting

### Emails not sending?
- Check that backend is running on `http://localhost:8000`
- Verify CORS settings in backend
- Check browser console for error messages

### AI Generation not working?
- Ensure backend has Google API key configured
- Check that `AI_KEY` environment variable is set in backend

### Styles not loading?
- Clear node_modules: `rm -rf node_modules && npm install`
- Rebuild: `npm run build`

## 📝 Environment Variables

Create a `.env` file if needed for API configuration:
```
VITE_API_URL=http://localhost:8000/api/v1
```

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 💬 Support

For issues or questions, please open an issue in the repository.

---

**Built with ❤️ using React + Vite + Tailwind CSS**
