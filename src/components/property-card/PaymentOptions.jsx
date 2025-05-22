import React from 'react';
import { Wallet, CreditCard, GraduationCap, BadgeDollarSign, DollarSign } from 'lucide-react';

const getIcon = (method) => {
  const lower = method.toLowerCase();
  if (lower.includes('private')) return <Wallet className="w-3 h-3 text-gray-600" />;
//   if (lower.includes('card') || lower.includes('credit')) return <CreditCard className="w-3 h-3 text-gray-600" />;
  if (lower.includes('bursary'))return <CreditCard className="w-3 h-3 text-gray-600"/>;
  if (lower.includes('nsfas')) return <BadgeDollarSign className="w-3 h-3 text-gray-600" />;
  return <DollarSign className="w-3 h-3 text-gray-600" />;
};

export const PaymentOptions = ({ methods }) => {
  if (!methods?.length) return null;

  return (
    <div className="mb-3">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Options</span>
      <div className="flex flex-wrap gap-1.5 mt-1">
        {methods.slice(0, 3).map((m, i) => (
          <div key={i} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
            {getIcon(m)}
            <span className="text-xs text-gray-700">{m}</span>
          </div>
        ))}
        {methods.length > 3 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
            <span className="text-xs text-gray-700">+{methods.length - 3} more</span>
          </div>
        )}
      </div>
    </div>
  );
};
