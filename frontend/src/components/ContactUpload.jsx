import React, { useRef, useState } from 'react';
import { FiUpload, FiTrash2 } from 'react-icons/fi';

export default function ContactUpload({ onContactsLoad }) {
  const fileInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file) => {
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const contacts = lines.slice(1).map(line => {
          const [name, email, company] = line.split(',').map(col => col.trim());
          return { name, email, company };
        }).filter(c => c.email && c.email.includes('@'));
        onContactsLoad(contacts);
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  return (
    <div className="card p-6 animate-fade-in">
      <h3 className="text-lg font-bold text-gray-800 mb-4">📤 Import Contacts</h3>
      
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragging 
            ? 'border-blue-500 bg-blue-50 scale-105' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <FiUpload className="w-10 h-10 mx-auto mb-3 text-blue-500" />
        <p className="font-semibold text-gray-700">Drag & drop CSV or click to browse</p>
        <p className="text-sm text-gray-500 mt-1">Format: name, email, company</p>
        <input 
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={(e) => handleFileSelect(e.target.files[0])}
          className="hidden"
        />
      </div>

      {uploadedFile && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200 flex justify-between items-center animate-slide-in">
          <div>
            <p className="font-semibold text-green-800">✓ File Uploaded</p>
            <p className="text-sm text-green-700">{uploadedFile.name}</p>
          </div>
          <button
            onClick={() => setUploadedFile(null)}
            className="text-green-600 hover:text-red-600 transition"
          >
            <FiTrash2 className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
