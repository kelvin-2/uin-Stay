import React from 'react';
import { Mail, Phone, MessageCircle } from 'lucide-react';


const ContactInfo = () => (
  <div className="bg-blue-50 p-8 rounded-lg">
    <h2 className="text-2xl font-semibold text-blue-600 mb-6">Get in Touch</h2>
    <div className="space-y-6">
      {[
        { icon: Mail, title: 'Email', detail: 'support@uinstay.co.za' },
        { icon: Phone, title: 'Phone', detail: '+27 639 604 148' },
        { icon: MessageCircle, title: 'Live Chat(Whatsapp)', detail: 'Available 9 AM - 5 PM CAT' },
      ].map((info, idx) => (
        <div key={idx} className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <info.icon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-blue-900">{info.title}</h3>
            <p className="text-blue-600">{info.detail}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ContactInfo;
