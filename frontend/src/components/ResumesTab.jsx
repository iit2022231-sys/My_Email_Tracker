import React, { useState, useEffect } from 'react';
import { FiUpload, FiTrash2, FiEdit2, FiX } from 'react-icons/fi';
import { resumeService } from '../api/database_service';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min?url';

export default function ResumesTab() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({ name: '', content: '' });
  const [isEditing, setIsEditing] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Load resumes on component mount
  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await resumeService.listResumes();
      setResumes(data);
    } catch (err) {
      setError('Failed to load resumes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type - accept .txt and .pdf
    const fileType = file.name.toLowerCase();
    if (!fileType.endsWith('.txt') && !fileType.endsWith('.pdf')) {
      setError('Only .txt and .pdf files are supported.');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      let content = '';
      const name = file.name.replace(/\.(txt|pdf)$/i, '');

      if (fileType.endsWith('.pdf')) {
        // Convert PDF to text
        content = await convertPdfToText(file);
      } else {
        // Read text file directly
        const reader = new FileReader();
        content = await new Promise((resolve, reject) => {
          reader.onload = (event) => resolve(event.target.result);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsText(file);
        });
      }

      setFormData({ name, content });
      setIsUploading(false);
    } catch (err) {
      setError(err.message || 'Failed to process file');
      setIsUploading(false);
    }
  };

  const convertPdfToText = async (file) => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.content.trim()) {
      setError('Resume name and content are required');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      if (isEditing) {
        // Update existing resume
        await resumeService.updateResume(isEditing, formData.name, formData.content);
        setSuccessMsg('Resume updated successfully!');
      } else {
        // Create new resume
        await resumeService.createResume(formData.name, formData.content);
        setSuccessMsg('Resume uploaded successfully!');
      }

      setFormData({ name: '', content: '' });
      setIsEditing(null);
      setTimeout(() => setSuccessMsg(null), 3000);
      
      // Reload resumes list
      await loadResumes();
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Failed to save resume');
      }
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = async (resume) => {
    try {
      // Fetch full resume content
      const fullResume = await resumeService.getResume(resume.id);
      setFormData({ name: fullResume.name, content: fullResume.content });
      setIsEditing(resume.id);
    } catch (err) {
      setError('Failed to load resume for editing');
      console.error(err);
    }
  };

  const handleDelete = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;

    try {
      setError(null);
      await resumeService.deleteResume(resumeId);
      setSuccessMsg('Resume deleted successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
      await loadResumes();
    } catch (err) {
      setError('Failed to delete resume');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', content: '' });
    setIsEditing(null);
    setError(null);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Success Message */}
      {successMsg && (
        <div className="p-4 bg-green-100 text-green-800 rounded-lg border border-green-300 flex items-center gap-2">
          <div className="text-lg">✓</div>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded-lg border border-red-300 flex items-center gap-2">
          <div className="text-lg">✕</div>
          <span>{error}</span>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          {isEditing ? 'Edit Resume' : 'Upload New Resume'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Resume Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Software Engineer 2024"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isUploading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Give your resume a meaningful name for easy identification
            </p>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isEditing ? 'Update Resume Content' : 'Choose File'}
            </label>
            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                <FiUpload className="text-gray-500" size={20} />
                <span className="text-gray-600 text-sm font-medium">
                  {isEditing ? 'Replace File' : 'Choose File'}
                </span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".txt,.pdf"
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              📝 Supported formats: Plain Text (.txt) or PDF (.pdf) - Max 5MB
            </p>
            <p className="text-xs text-green-600 mt-1">
              ✓ PDFs are automatically converted to text and stored as plain text
            </p>
          </div>

          {/* Resume Preview */}
          {formData.content && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview/Edit Content
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  ✓ Text Format
                </span>
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-80"
                placeholder="Resume content appears here..."
                disabled={isUploading}
              />
              <p className="text-xs text-gray-500 mt-2">
                📄 Your resume is stored and used as plain text for AI email generation
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            {isEditing && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                disabled={isUploading}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isUploading || !formData.name || !formData.content}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 flex items-center gap-2"
            >
              <FiUpload size={16} />
              {isUploading ? 'Saving...' : isEditing ? 'Update Resume' : 'Upload Resume'}
            </button>
          </div>
        </form>
      </div>

      {/* Resumes List Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Your Resumes ({resumes.length})
        </h3>

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
            <p className="mt-2">Loading resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-2">No resumes uploaded yet</p>
            <p className="text-sm text-gray-500">Upload your first resume to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{resume.name}</h4>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(resume.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(resume)}
                    className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                    title="Edit resume"
                    disabled={isUploading}
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                    title="Delete resume"
                    disabled={isUploading}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
