import React, { useState } from 'react';
import { FiSearch, FiTrash2, FiCheck, FiPlus } from 'react-icons/fi';

export default function HRTable({ contacts, selected, setSelected, onAddContact, onRemoveContact }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', email: '', company: '' });

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newContact.name.trim() || !newContact.email.trim() || !newContact.company.trim()) {
      alert('Please fill all fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newContact.email)) {
      alert('Please enter a valid email');
      return;
    }
    onAddContact(newContact);
    setNewContact({ name: '', email: '', company: '' });
    setShowAddForm(false);
  };

  const handleDeleteContact = (email) => {
    if (window.confirm('Delete this contact?')) {
      onRemoveContact(email);
    }
  };

  const toggleSelect = (email) => {
    setSelected(prev => 
      prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === filteredContacts.length) {
      setSelected([]);
    } else {
      setSelected(filteredContacts.map(c => c.email));
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'company') return a.company.localeCompare(b.company);
    return 0;
  });

  const removeContact = (email) => {
    setSelected(prev => prev.filter(e => e !== email));
  };

  return (
    <div className="card p-6 animate-fade-in">
      <div className="mb-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">👥 HR Contacts</h3>
          <span className="badge badge-info">{selected.length} selected</span>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field text-sm"
          >
            <option value="name">Sort by Name</option>
            <option value="company">Sort by Company</option>
          </select>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="badge badge-primary px-4 py-2 cursor-pointer hover:opacity-80 flex items-center gap-2"
          >
            <FiPlus /> Add Contact
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddContact} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <input
                type="text"
                placeholder="Name"
                value={newContact.name}
                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                className="input-field text-sm"
              />
              <input
                type="email"
                placeholder="Email"
                value={newContact.email}
                onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                className="input-field text-sm"
              />
              <input
                type="text"
                placeholder="Company"
                value={newContact.company}
                onChange={(e) => setNewContact({...newContact, company: e.target.value})}
                className="input-field text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="badge badge-success px-4 py-2 cursor-pointer hover:opacity-80">
                Add Contact
              </button>
              <button 
                type="button"
                onClick={() => setShowAddForm(false)}
                className="badge badge-ghost px-4 py-2 cursor-pointer hover:opacity-80"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">📭 No contacts yet</p>
          <p className="text-sm text-gray-500">Upload a CSV file to get started</p>
        </div>
      ) : (
        <div className="overflow-x-auto overflow-y-auto max-h-96 rounded-lg border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-gray-50">
              <tr className="border-b-2 border-gray-200">
                <th className="pb-3 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selected.length === filteredContacts.length && filteredContacts.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </th>
                <th className="pb-3 px-3 font-semibold text-gray-700">Name</th>
                <th className="pb-3 px-3 font-semibold text-gray-700">Email</th>
                <th className="pb-3 px-3 font-semibold text-gray-700">Company</th>
                <th className="pb-3 px-3 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContacts.map((hr, idx) => (
                <tr 
                  key={`${hr.email}-${idx}`}
                  className={`hover:bg-blue-50 transition-colors ${
                    selected.includes(hr.email) ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(hr.email)}
                      onChange={() => toggleSelect(hr.email)}
                      className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-3 font-medium text-gray-900">{hr.name}</td>
                  <td className="py-3 px-3 text-gray-600 truncate">{hr.email}</td>
                  <td className="py-3 px-3">
                    <span className="badge badge-info text-xs">{hr.company}</span>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleDeleteContact(hr.email)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                      title="Delete contact"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredContacts.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-gray-400">🔍 No contacts found matching your search</p>
        </div>
      )}
    </div>
  );
}