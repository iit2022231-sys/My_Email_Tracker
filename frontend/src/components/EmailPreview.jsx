import React from 'react';
import { FiCopy, FiDownload } from 'react-icons/fi';

export default function EmailPreview({ email, onCopy }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(`${email.subject}\n\n${email.body}`);
    onCopy();
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`${email.subject}\n\n${email.body}`));
    element.setAttribute('download', 'email-draft.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="card p-6 animate-fade-in h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">👁️ Email Preview</h3>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center gap-2 text-sm text-blue-600"
          >
            <FiCopy /> Copy
          </button>
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center gap-2 text-sm text-blue-600"
          >
            <FiDownload /> Download
          </button>
        </div>
      </div>

      {email.subject ? (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Subject</p>
            <p className="text-gray-800 font-semibold">{email.subject}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-[400px] overflow-y-auto">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Message</p>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{email.body}</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Generate variations using the AI Assistant to test different messaging angles
            </p>
          </div>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-center">
          <p className="text-gray-400">
            👈 Generate an email using the AI Assistant or select a template to get started
          </p>
        </div>
      )}
    </div>
  );
}
