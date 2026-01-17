import React, { useState } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

const TEMPLATES = [
  {
    id: 1,
    name: 'Cold Email - Software Role',
    category: 'Job Application',
    subject: 'Interested in Frontend Developer position at {company}',
    body: `Hi {name},

I hope this email finds you well. I\'m reaching out because I\'m impressed with {company}\'s innovative approach to {industry}.

With {years} years of experience in frontend development and a track record of building scalable applications, I believe I can add significant value to your team.

I\'d love to discuss how my skills in React, TypeScript, and modern web technologies align with your team\'s needs.

Would you be available for a 20-minute call this week?

Best regards,
[Your Name]`
  },
  {
    id: 2,
    name: 'Startup Outreach',
    category: 'General Outreach',
    subject: 'Let\'s build something amazing together',
    body: `Hi {name},

I\'ve been following {company}\'s journey and love what you\'re building.

As someone passionate about {industry}, I think there might be great opportunities to collaborate. I have experience in {expertise} and believe I could help accelerate your growth.

Happy to grab coffee (virtual or in-person) to explore possibilities.

Looking forward to hearing from you!

Cheers,
[Your Name]`
  },
  {
    id: 3,
    name: 'Consulting Follow-up',
    category: 'Follow-up',
    subject: 'Following up on our conversation',
    body: `Hi {name},

Thank you for taking the time to chat last {when}. I really enjoyed our conversation about {topic}.

I\'ve been thinking about what you mentioned regarding {challenge}, and I believe I have some valuable insights to share.

Would you be open to continuing our discussion next week?

Best regards,
[Your Name]`
  },
  {
    id: 4,
    name: 'Partnership Proposal',
    category: 'Business',
    subject: 'Partnership opportunity - {company}',
    body: `Hi {name},

I\'ve been impressed by {company}\'s success in the {industry} space.

I believe there\'s a compelling opportunity for our organizations to collaborate and create mutual value. Specifically, I see potential in {opportunity}.

I\'d love to present a detailed proposal at your convenience. Are you available for a brief call this week?

Best regards,
[Your Name]`
  },
  {
    id: 5,
    name: 'Networking Request',
    category: 'Networking',
    subject: 'Would love to connect',
    body: `Hi {name},

I noticed we both share a passion for {interest} in the {industry} space.

I\'ve been following your work on {project/achievement} and find it really inspiring.

I\'d love to connect and learn more about your journey. Would you be open to grabbing a coffee or virtual chat?

Best regards,
[Your Name]`
  },
];

export default function EmailTemplates({ onSelectTemplate }) {
  const [expanded, setExpanded] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    onSelectTemplate(template);
  };

  const categories = [...new Set(TEMPLATES.map(t => t.category))];

  return (
    <div className="card p-6 animate-fade-in">
      <h3 className="text-lg font-bold text-gray-800 mb-4">📧 Email Templates</h3>
      
      <div className="space-y-2">
        {TEMPLATES.map((template) => (
          <div
            key={template.id}
            className={`rounded-lg border-2 transition-all duration-300 ${
              selectedTemplate?.id === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <button
              onClick={() => {
                handleSelectTemplate(template);
                setExpanded(expanded === template.id ? null : template.id);
              }}
              className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition"
            >
              <div className="text-left flex-1">
                <p className="font-semibold text-gray-800">{template.name}</p>
                <p className="text-xs text-gray-500 mt-1">{template.category}</p>
              </div>
              <div className="flex items-center gap-2">
                {selectedTemplate?.id === template.id && (
                  <FiCheck className="w-5 h-5 text-blue-600" />
                )}
                <FiChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expanded === template.id ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {expanded === template.id && (
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 animate-fade-in">
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Subject</p>
                  <p className="text-sm text-gray-700 font-medium">{template.subject}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Preview</p>
                  <p className="text-sm text-gray-600 line-clamp-3 whitespace-pre-wrap">{template.body}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
        <p className="text-sm text-amber-800">
          <strong>💡 Tip:</strong> Replace placeholders like {'{name}'}, {'{company}'} with actual values when sending
        </p>
      </div>
    </div>
  );
}
