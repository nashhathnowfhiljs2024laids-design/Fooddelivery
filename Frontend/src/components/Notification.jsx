import React from 'react';
import { CheckCircle, X } from 'lucide-react';

const Notification = ({ notification, onClose }) => {
  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in">
      <CheckCircle className="w-5 h-5" />
      <span>{notification.message}</span>
      <button onClick={onClose} className="ml-2">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Notification;