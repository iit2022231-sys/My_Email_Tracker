import React, { useState } from 'react';
import { FiZap, FiRefreshCw } from 'react-icons/fi';

export default function AIPrompt({ onGenerate, loading, resumes = [], selectedResumeId, onSelectResume }) {
  const [input, setInput] = useState("");
  const [context, setContext] = useState("Job application for a software role");
  const [wordLength, setWordLength] = useState("100-200");
  const [subjectMode, setSubjectMode] = useState("ai");
  const [customSubject, setCustomSubject] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenerate = () => {
    if (input.trim()) {
      const fullContext = `${input}\n\nContext: ${context}\nWord Length: ${wordLength} words${subjectMode === "manual" && customSubject ? `\nSubject: ${customSubject}` : ""}`;
      onGenerate(fullContext, context);
    }
  };

  const quickPrompts = [
    "Write a compelling cold email for a Junior Developer role",
    "Create an outreach email for a startup",
    "Draft a follow-up email after an interview",
    "Write a networking email"
  ];

  return (
    <div className="card p-6 animate-fade-in space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FiZap className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-bold text-gray-800">✨ AI Email Generator</h2>
      </div>

      {/* Main Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Email Idea</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., Write a cold email for a Software Engineer role at a tech startup, emphasizing my React experience..."
          className="input-field h-24 resize-none"
        />
      </div>

      {/* Resume Selector */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          📄 Resume Context (Optional)
        </label>
        {resumes.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
            <p className="font-medium mb-1">No resumes yet</p>
            <p className="text-xs">Go to the <strong>Resumes</strong> tab to upload your resume</p>
          </div>
        ) : (
          <select
            value={selectedResumeId || ''}
            onChange={(e) => onSelectResume(e.target.value ? parseInt(e.target.value) : null)}
            className="input-field text-sm"
          >
            <option value="">Select a resume...</option>
            {resumes.map((resume) => (
              <option key={resume.id} value={resume.id}>
                {resume.name}
              </option>
            ))}
          </select>
        )}
        {selectedResumeId && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-2 mt-2">
            <p className="text-sm text-green-800">
              ✓ Resume will be included in email generation for better personalization
            </p>
          </div>
        )}
      </div>

      {/* Advanced Options */}
      <div className="border-t pt-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition flex items-center gap-1"
        >
          {showAdvanced ? '▼' : '▶'} Advanced Options
        </button>

        {showAdvanced && (
          <div className="mt-3 animate-fade-in space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Context/Role</label>
              <select
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="input-field text-sm"
              >
                <option value="Job application for a software role">Job Application - Software</option>
                <option value="Business partnership proposal">Business Partnership</option>
                <option value="Startup funding outreach">Startup Outreach</option>
                <option value="Networking and relationship building">Networking</option>
                <option value="Internship application">Internship Application</option>
                <option value="Freelance project proposal">Freelance Proposal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Word Length</label>
              <select
                value={wordLength}
                onChange={(e) => setWordLength(e.target.value)}
                className="input-field text-sm"
              >
                <option value="50-100">Short (50-100 words)</option>
                <option value="100-200">Medium (100-200 words)</option>
                <option value="200+">Long (200+ words)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Line</label>
              <div className="flex gap-2 mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="subjectMode"
                    value="ai"
                    checked={subjectMode === "ai"}
                    onChange={(e) => setSubjectMode(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">AI Generated</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="subjectMode"
                    value="manual"
                    checked={subjectMode === "manual"}
                    onChange={(e) => setSubjectMode(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Manual Entry</span>
                </label>
              </div>
              {subjectMode === "manual" && (
                <input
                  type="text"
                  placeholder="Enter your subject line..."
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="input-field text-sm"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs font-semibold text-gray-600 mb-2">💡 Quick Prompts</p>
        <div className="grid grid-cols-1 gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setInput(prompt)}
              className="text-left text-xs px-3 py-2 bg-white hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition text-gray-700 font-medium"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading || !input.trim()}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <FiRefreshCw className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <FiZap className="w-5 h-5" />
            Generate Email
          </>
        )}
      </button>
    </div>
  );
}