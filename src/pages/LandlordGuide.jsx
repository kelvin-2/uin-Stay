import React, { useState } from 'react';
import { 
  User, 
  Home, 
  MessageCircle, 
  Star, 
  HelpCircle, 
  Phone, 
  Mail, 
  MessageSquare 
} from 'lucide-react';

const LandlordGuide = () => {
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      title: "Getting Started",
      icon: <User className="w-5 h-5" />,
      content: (
        <div>
          <h3 className="text-xl font-semibold mb-4">Creating an Account</h3>
          <ol className="space-y-2 list-decimal pl-5">
            <li>Visit uinStay website</li>
            <li>Click on <strong>Sign Up</strong> and select <strong>Landlord Account</strong></li>
            <li>Fill in your details, including name, email, and contact information</li>
            <li>Verify your email and log in to your account</li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-4">Setting Up Your Profile</h3>
          <ol className="space-y-2 list-decimal pl-5">
            <li>Navigate to the <strong>Profile</strong> section in your dashboard</li>
            <li>Add a profile picture and your contact details</li>
            <li>Provide a short description about you or your business to build trust</li>
          </ol>
        </div>
      )
    },
    {
      title: "Listing Properties",
      icon: <Home className="w-5 h-5" />,
      content: (
        <div>
          <h3 className="text-xl font-semibold mb-4">Adding a New Listing</h3>
          <ol className="space-y-2 list-decimal pl-5">
            <li>Go to the <strong>Listings</strong> tab and click <strong>Add New Property</strong></li>
            <li>Fill in required details:
              <ul className="list-disc pl-5">
                <li>Property title</li>
                <li>Address and location</li>
                <li>Rent amount and deposit</li>
                <li>Room type and availability</li>
                <li>Amenities</li>
              </ul>
            </li>
            <li>Upload high-quality, well-lit property images</li>
            <li>Preview and publish your listing</li>
          </ol>
        </div>
      )
    },
    {
      title: "Communicating with Students",
      icon: <MessageCircle className="w-5 h-5" />,
      content: (
        <div>
          <h3 className="text-xl font-semibold mb-4">Responding to Inquiries</h3>
          <ol className="space-y-2 list-decimal pl-5">
            <li>Check <strong>Messages</strong> tab for student inquiries</li>
            <li>Respond promptly via WhatsApp</li>
            <li>Be clear about property terms</li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-4">Scheduling Property Visits</h3>
          <ul className="space-y-2 list-disc pl-5">
            <li>Offer flexible visit timings</li>
            <li>Provide clear directions</li>
            <li>Share WhatsApp contact for coordination</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">uinStay Landlord Guide</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Everything you need to know to successfully list and manage your properties
          </p>
        </div>

        {/* Navigation and Content */}
        <div className="grid md:grid-cols-3 gap-4 p-6">
          {/* Sidebar Navigation */}
          <div className="space-y-2">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => setActiveSection(activeSection === index ? null : index)}
                className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                  activeSection === index 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {section.icon}
                {section.title}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="md:col-span-2 bg-gray-50 p-6 rounded-lg">
            {activeSection !== null ? (
              sections[activeSection].content
            ) : (
              <div className="text-center text-gray-500">
                Select a section to view details
              </div>
            )}
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-gray-200 p-8 text-center">
          <h3 className="text-2xl font-semibold mb-4">Need Help?</h3>
          <div className="flex justify-center space-x-4">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              <span>support@uinstay.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-500" />
              <span>+1 (123) 456-7890</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-500" />
              <span>Live Chat Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordGuide;