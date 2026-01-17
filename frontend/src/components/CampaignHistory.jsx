import React, { useState } from 'react';
import { FiDownload, FiX } from 'react-icons/fi';

export default function CampaignHistory({ campaigns, onDelete }) {
  const [expandedId, setExpandedId] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'sent':
        return 'badge badge-success';
      case 'draft':
        return 'badge badge-warning';
      case 'failed':
        return 'badge badge-danger';
      default:
        return 'badge badge-info';
    }
  };

  return (
    <div className="card p-6 animate-fade-in">
      <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Campaign History</h3>

      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-2">📭 No campaigns yet</p>
          <p className="text-sm text-gray-500">Your sent campaigns will appear here</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {campaigns.map((campaign, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
              <button
                onClick={() => setExpandedId(expandedId === idx ? null : idx)}
                className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition"
              >
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-800 truncate">{campaign.subject}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {campaign.recipientCount} recipients • {campaign.date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={getStatusBadge(campaign.status)}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </span>
                </div>
              </button>

              {expandedId === idx && (
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 space-y-3 animate-fade-in">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Message Preview</p>
                    <p className="text-sm text-gray-700 line-clamp-3 whitespace-pre-wrap">{campaign.body}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium">
                      <FiDownload className="w-4 h-4" />
                      Export
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(idx)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                    >
                      <FiX className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
