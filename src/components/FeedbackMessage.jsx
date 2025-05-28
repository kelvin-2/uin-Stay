import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const FeedbackMessage = ({ type, message, onClose }) => {
  if (!message) return null;

  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };

  const textColor = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800'
  };

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: AlertCircle
  };

  const IconComponent = Icon[type];

  return (
    <div className={`p-3 rounded-lg border flex items-start gap-3 ${bgColor[type]}`}>
      <IconComponent className={`h-5 w-5 mt-0.5 flex-shrink-0 ${textColor[type]}`} />
      <p className={`text-sm flex-1 ${textColor[type]}`}>{message}</p>
      {onClose && type !== 'info' && (
        <button 
          onClick={onClose}
          className={`${textColor[type]} hover:opacity-70`}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default FeedbackMessage;