import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Centralized error handler
const handleError = (error) => {
  console.error('API Error:', error.response?.data?.detail || error.message);
  throw error;
};

// Email Service
export const emailService = {
  async generateDraft(prompt, context = 'Job application for a software role') {
    try {
      const res = await apiClient.post('/email-tools/generate-content', { prompt, context });
      return res.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async sendBulk(hrEmails, subject, body) {
    try {
      const res = await apiClient.post('/email-tools/send-bulk', { 
        hr_emails: hrEmails, 
        subject, 
        body 
      });
      return res.data;
    } catch (error) {
      return handleError(error);
    }
  },

  // Validate emails locally before sending
  validateEmails(emails) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emails.every(email => emailRegex.test(email));
  },

  exportCampaign(campaign) {
    const dataStr = JSON.stringify(campaign, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(dataStr));
    element.setAttribute('download', `campaign-${Date.now()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
};

// Resume Service
export const resumeService = {
  async listResumes() {
    try {
      const response = await apiClient.get('/resumes');
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async getResume(resumeId) {
    try {
      const response = await apiClient.get(`/resumes/${resumeId}`);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async createResume(name, content) {
    try {
      const response = await apiClient.post('/resumes', { name, content });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async updateResume(resumeId, name, content) {
    try {
      const response = await apiClient.put(`/resumes/${resumeId}`, {
        name: name || undefined,
        content: content || undefined,
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async deleteResume(resumeId) {
    try {
      await apiClient.delete(`/resumes/${resumeId}`);
    } catch (error) {
      return handleError(error);
    }
  },
};

// Config Service
export const configService = {
  async getConfig() {
    try {
      const response = await apiClient.get('/config/credentials');
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async testConnection(credentials) {
    try {
      const response = await apiClient.post('/config/test-connection', credentials);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
};

export default apiClient;
