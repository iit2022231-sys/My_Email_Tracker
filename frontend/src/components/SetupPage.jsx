import React, { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw, FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';

export default function SetupPage() {
  const [credentials, setCredentials] = useState({
    gemini_api_key: '',
    smtp_server: '',
    smtp_port: '587',
    email_user: '',
    email_password: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    gemini_api_key: false,
    email_password: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [testing, setTesting] = useState(false);

  const API_BASE = 'http://localhost:8000/api/v1';

  // Load credentials on mount
  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE}/config/credentials`);
      setCredentials(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Validate required fields
      if (!credentials.gemini_api_key.trim()) {
        setError('Gemini API Key is required');
        setLoading(false);
        return;
      }
      if (!credentials.smtp_server.trim()) {
        setError('SMTP Server is required');
        setLoading(false);
        return;
      }
      if (!credentials.email_user.trim()) {
        setError('Email User is required');
        setLoading(false);
        return;
      }
      if (!credentials.email_password.trim()) {
        setError('Email Password is required');
        setLoading(false);
        return;
      }

      await axios.post(`${API_BASE}/config/credentials`, credentials);
      setSuccess('Credentials saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to save credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setTesting(true);
      setError(null);
      setSuccess(null);

      const response = await axios.post(`${API_BASE}/config/test-connection`, credentials);
      setSuccess('✓ ' + response.data.message);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error(err);
      setError('✕ ' + (err.response?.data?.detail || 'Connection test failed'));
    } finally {
      setTesting(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">⚙️ Setup Credentials</h1>
        <p className="text-gray-600">
          Configure your API keys and email settings here. All credentials are securely stored on the server.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded-lg border border-red-300 flex items-center gap-2">
          <div className="text-lg">✕</div>
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-100 text-green-800 rounded-lg border border-green-300 flex items-center gap-2">
          <div className="text-lg">✓</div>
          <span>{success}</span>
        </div>
      )}

      {/* Credentials Form */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Gemini API Key */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🔑 Gemini API Key
          </label>
          <div className="relative">
            <input
              type={showPasswords.gemini_api_key ? 'text' : 'password'}
              name="gemini_api_key"
              value={credentials.gemini_api_key}
              onChange={handleChange}
              placeholder="AIzaSyBgYmCo0aDhXagU79C7x0drlV_8Qsx8ArU"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={() => togglePasswordVisibility('gemini_api_key')}
              className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
            >
              {showPasswords.gemini_api_key ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Get your API key from: <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>
          </p>
        </div>

        {/* SMTP Server */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📧 SMTP Server
          </label>
          <input
            type="text"
            name="smtp_server"
            value={credentials.smtp_server}
            onChange={handleChange}
            placeholder="smtp.gmail.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            For Gmail: smtp.gmail.com | For Outlook: smtp.office365.com
          </p>
        </div>

        {/* SMTP Port */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🔌 SMTP Port
          </label>
          <input
            type="number"
            name="smtp_port"
            value={credentials.smtp_port}
            onChange={handleChange}
            placeholder="587"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Common ports: 587 (TLS) or 465 (SSL)
          </p>
        </div>

        {/* Email User */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            👤 Email Address
          </label>
          <input
            type="email"
            name="email_user"
            value={credentials.email_user}
            onChange={handleChange}
            placeholder="quantroadmap@gmail.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            The email address that will send the emails
          </p>
        </div>

        {/* Email Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🔐 Email Password / App Password
          </label>
          <div className="relative">
            <input
              type={showPasswords.email_password ? 'text' : 'password'}
              name="email_password"
              value={credentials.email_password}
              onChange={handleChange}
              placeholder="sbdn sqcs ypyh wosn"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={() => togglePasswordVisibility('email_password')}
              className="absolute right-3 top-3 text-gray-600 hover:text-gray-800"
            >
              {showPasswords.email_password ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            For Gmail: Use 16-character <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">App Password</a>, not your regular password
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6 flex gap-2">
        <button
          onClick={handleSave}
          disabled={loading || testing}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <FiSave size={18} />
          {loading ? 'Saving...' : 'Save Credentials'}
        </button>
        <button
          onClick={handleTestConnection}
          disabled={loading || testing}
          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <FiRefreshCw size={18} className={testing ? 'animate-spin' : ''} />
          {testing ? 'Testing...' : 'Test Connection'}
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-lg shadow-md p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Security Notes</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>✓ Credentials are stored securely on the server</li>
          <li>✓ Never share your API keys or passwords</li>
          <li>✓ Use Gmail App Passwords instead of your regular password</li>
          <li>✓ Keep your credentials up to date for uninterrupted service</li>
        </ul>
      </div>
    </div>
  );
}
