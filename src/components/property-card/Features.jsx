import React from 'react';
import { Home, Shield, Wifi, Clock } from 'lucide-react';

export const Features = ({ roomType, amenities }) => {
  const hasSecurity = amenities?.includes('Security');
  const hasWiFi = amenities?.includes('Wi-Fi');

  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
        <Home className="w-5 h-5 text-gray-700 mb-1" />
        <span className="text-xs text-gray-700">{roomType || 'Studio'}</span>
      </div>
      <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
        {hasSecurity ? <Shield className="w-5 h-5 text-gray-700 mb-1" /> : <Clock className="w-5 h-5 text-gray-700 mb-1" />}
        <span className="text-xs text-gray-700">{hasSecurity ? 'Secure' : '24/7'}</span>
      </div>
      <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
        <Wifi className="w-5 h-5 text-gray-700 mb-1" />
        <span className="text-xs text-gray-700">WiFi</span>
      </div>
    </div>
  );
};
