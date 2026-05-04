import React from 'react';
import { CheckCircle, X } from 'lucide-react';

const Notification = ({ notification, onClose }) => {
  if (!notification) return null;

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-gray-900',
    info: 'bg-blue-500 text-white',
  };

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in ${typeStyles[notification.type] || typeStyles.success}`}>
      <CheckCircle className="w-5 h-5" />
      <span>{notification.message}</span>
      <button onClick={onClose} className="ml-2">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Notification;