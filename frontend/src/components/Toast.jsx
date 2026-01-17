import React, { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';

export default function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="w-5 h-5" />;
      case 'error':
        return <FiAlertCircle className="w-5 h-5" />;
      default:
        return <FiCheckCircle className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    const baseStyles = 'fixed bottom-6 right-6 flex items-center gap-3 px-6 py-4 rounded-lg shadow-xl text-white font-medium animate-fade-in-up z-50';
    switch (type) {
      case 'success':
        return `${baseStyles} bg-gradient-to-r from-green-500 to-green-600`;
      case 'error':
        return `${baseStyles} bg-gradient-to-r from-red-500 to-red-600`;
      default:
        return `${baseStyles} bg-gradient-to-r from-blue-500 to-blue-600`;
    }
  };

  return (
    <div className={getStyles()}>
      {getIcon()}
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition">
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
}
