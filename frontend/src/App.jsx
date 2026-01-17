import React, { useState, useEffect } from 'react';
import { FiSend, FiMenu, FiX, FiArrowRight, FiEdit2, FiSettings } from 'react-icons/fi';
import { emailService, resumeService } from './api/apiClient';

import HRTable from './components/HRTable';
import AIPrompt from './components/AIPrompt';
import EmailTemplates from './components/EmailTemplates';
import EmailPreview from './components/EmailPreview';
import ContactUpload from './components/ContactUpload';
import CampaignHistory from './components/CampaignHistory';
import ResumesTab from './components/ResumesTab';
import SetupPage from './components/SetupPage';
import Toast from './components/Toast';

import './index.css';

function App() {
  // Contacts state
  const [contacts, setContacts] = useState([
    { name: 'Alice Smith', company: 'TechCorp', email: 'alice@techcorp.com' },
    { name: 'Bob Jones', company: 'DevStudio', email: 'bob@devstudio.com' },
    { name: 'Carol White', company: 'StartupXYZ', email: 'carol@startupxyz.com' },
  ]);
  const [selectedHRs, setSelectedHRs] = useState([]);

  // Compose flow state
  const [composeStep, setComposeStep] = useState('select'); // 'select' | 'generate' | 'edit' | 'preview'
  const [emailDraft, setEmailDraft] = useState({ subject: '', body: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState(null);

  // Resume state
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(null);

  // Campaign state
  const [campaigns, setCampaigns] = useState(() => {
    const saved = localStorage.getItem('campaigns');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('compose');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* ============ Effects ============ */

  useEffect(() => {
    loadResumes();
  }, []);

  useEffect(() => {
    localStorage.setItem('campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  /* ============ Helpers ============ */

  const showToast = (message, type = 'info', duration = 4000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  const loadResumes = async () => {
    try {
      const data = await resumeService.listResumes();
      setResumes(data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ============ Contact & Flow Handlers ============ */

  const handleContactsSelected = () => {
    if (selectedHRs.length === 0) {
      showToast('Please select at least one contact', 'warning');
      return;
    }
    setComposeStep('generate');
  };

  const handleAddContact = (newContact) => {
    setContacts([...contacts, newContact]);
    showToast(`Contact "${newContact.name}" added successfully!`, 'success');
  };

  const handleRemoveContact = (email) => {
    setContacts(contacts.filter(contact => contact.email !== email));
    setSelectedHRs(selectedHRs.filter(e => e !== email));
    showToast('Contact deleted', 'info');
  };

  /* ============ Email Generation ============ */

  const handleGenerate = async (prompt, context) => {
    if (!prompt.trim()) {
      showToast('Please enter a prompt', 'warning');
      return;
    }

    setIsGenerating(true);

    try {
      let fullContext = context;

      if (selectedResumeId) {
        const resume = await resumeService.getResume(selectedResumeId);
        fullContext += `\n\nResume:\n${resume.content}`;
      }

      const data = await emailService.generateDraft(prompt, fullContext);
      processEmailContent(data);
      setComposeStep('edit');
      showToast('Email generated successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate email', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const processEmailContent = (data) => {
    if (!data?.content) return;

    try {
      const parsed = JSON.parse(data.content);
      setEmailDraft({
        subject: parsed.subject || 'Email Subject',
        body: parsed.body || '',
      });
    } catch {
      const lines = data.content.split('\n');
      setEmailDraft({
        subject: lines[0] || 'Email Subject',
        body: lines.slice(1).join('\n'),
      });
    }
  };

  const handleTemplateSelect = (template) => {
    setEmailDraft(template);
    setComposeStep('edit');
    showToast('Template applied', 'info');
  };

  /* ============ Send Email ============ */

  const handleSend = async () => {
    if (!emailService.validateEmails(selectedHRs)) {
      showToast('Invalid email detected', 'error');
      return;
    }

    setIsSending(true);

    try {
      await emailService.sendBulk(selectedHRs, emailDraft.subject, emailDraft.body);

      const campaign = {
        subject: emailDraft.subject,
        body: emailDraft.body,
        recipientCount: selectedHRs.length,
        date: new Date().toLocaleDateString(),
        status: 'sent',
        recipients: selectedHRs,
      };

      setCampaigns([campaign, ...campaigns]);
      showToast('Emails sent successfully!', 'success');

      // Reset flow
      setTimeout(() => {
        setSelectedHRs([]);
        setEmailDraft({ subject: '', body: '' });
        setComposeStep('select');
      }, 2000);
    } catch (err) {
      console.error(err);
      showToast('Failed to send emails', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const deleteCampaign = (idx) => {
    setCampaigns(campaigns.filter((_, i) => i !== idx));
    showToast('Campaign deleted', 'info');
  };

  /* ============ Render ============ */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">📧 Email Bulk Sender</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveTab('compose')}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${activeTab === 'compose' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
          >
            ✍️ Compose
          </button>
          <button 
            onClick={() => setActiveTab('resumes')}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${activeTab === 'resumes' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
          >
            📄 Resumes
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
          >
            📋 History
          </button>
          <button 
            onClick={() => setActiveTab('setup')}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ml-auto ${activeTab === 'setup' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
          >
            <FiSettings className="inline mr-2" />
            Setup
          </button>
        </div>

        {activeTab === 'compose' && (
          <div className="space-y-6">
            {/* Step 1: Select Contacts */}
            {(composeStep === 'select' || composeStep === 'generate' || composeStep === 'edit' || composeStep === 'preview') && (
              <div className={`transition-all ${composeStep !== 'select' ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
                <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Step 1: Import & Select Contacts
                  </h2>
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <ContactUpload onContactsLoad={setContacts} />
                    </div>
                    <div>
                      <HRTable
                        contacts={contacts}
                        selected={selectedHRs}
                        setSelected={setSelectedHRs}
                        onAddContact={handleAddContact}
                        onRemoveContact={handleRemoveContact}
                      />
                    </div>
                  </div>
                </div>
                {selectedHRs.length > 0 && (
                  <button
                    onClick={handleContactsSelected}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2"
                  >
                    Continue with {selectedHRs.length} Contact{selectedHRs.length !== 1 ? 's' : ''} <FiArrowRight />
                  </button>
                )}
              </div>
            )}

            {/* Step 2: Generate or Template */}
            {composeStep !== 'select' && (
              <div className={`transition-all ${composeStep === 'generate' ? 'opacity-100' : 'opacity-60 pointer-events-none'}`}>
                <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Step 2: Choose Email Source
                  </h2>
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <AIPrompt
                        onGenerate={handleGenerate}
                        loading={isGenerating}
                        resumes={resumes}
                        selectedResumeId={selectedResumeId}
                        onSelectResume={setSelectedResumeId}
                      />
                    </div>
                    <div>
                      <EmailTemplates onSelectTemplate={handleTemplateSelect} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Edit Email */}
            {composeStep === 'edit' && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FiEdit2 /> Step 3: Edit Email
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                    <input
                      type="text"
                      value={emailDraft.subject}
                      onChange={(e) => setEmailDraft({ ...emailDraft, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Body</label>
                    <textarea
                      value={emailDraft.body}
                      onChange={(e) => setEmailDraft({ ...emailDraft, body: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-80"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setComposeStep('preview')}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                    >
                      Preview & Send
                    </button>
                    <button
                      onClick={() => setComposeStep('generate')}
                      className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
                    >
                      Back to Generate
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Preview & Send */}
            {composeStep === 'preview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Step 4: Final Preview
                  </h2>
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2">Sending to {selectedHRs.length} contact{selectedHRs.length !== 1 ? 's' : ''}:</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedHRs.slice(0, 5).map((email, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {email}
                        </span>
                      ))}
                      {selectedHRs.length > 5 && (
                        <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm">
                          +{selectedHRs.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                  <EmailPreview email={emailDraft} />
                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={handleSend}
                      disabled={isSending}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <FiSend size={18} />
                      {isSending ? 'Sending...' : 'Send Emails'}
                    </button>
                    <button
                      onClick={() => setComposeStep('edit')}
                      className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                    >
                      Edit Again
                    </button>
                    <button
                      onClick={() => {
                        setComposeStep('select');
                        setSelectedHRs([]);
                        setEmailDraft({ subject: '', body: '' });
                      }}
                      className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
                    >
                      Start Over
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'resumes' && <ResumesTab />}
        {activeTab === 'history' && (
          <CampaignHistory campaigns={campaigns} onDelete={deleteCampaign} />
        )}
        {activeTab === 'setup' && <SetupPage />}
      </main>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default App;
