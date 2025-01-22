import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const CustomAccordion = ({ items }) => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="border border-blue-100 rounded-lg">
          <button
            className="w-full px-4 py-3 flex justify-between items-center text-left hover:bg-blue-50"
            onClick={() => toggleItem(idx)}
          >
            <span className="font-medium text-blue-900">{item.question}</span>
            <ChevronDown 
              className={`h-5 w-5 transition-transform text-blue-500 ${openItems[idx] ? 'transform rotate-180' : ''}`}
            />
          </button>
          <div className={`px-4 overflow-hidden transition-all ${openItems[idx] ? 'max-h-96 py-3' : 'max-h-0'}`}>
            {item.answer}
          </div>
        </div>
      ))}
    </div>
  );
};

const FAQSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('students');

  const faqData = {
    students: [
      {
        category: "Finding Accommodation",
        items: [
          {
            question: "How do I search for accommodation on UIN Stay?",
            answer: "You can search for properties using our search bar and filters. Filter by location, price range, room type, and amenities to find the perfect match for your needs."
          },
          {
            question: "Is the information about properties up to date?",
            answer: "Yes, landlords are required to keep their listings current. However, we recommend contacting the landlord to confirm availability before making any decisions."
          },
          {
            question: "Can I save properties I'm interested in?",
            answer: "Yes, you can bookmark properties to view later by clicking the 'Save' button on any listing. Access your saved properties through your account dashboard."
          }
        ]
      },
      {
        category: "Booking and Payments",
        items: [
          {
            question: "How do I book a property?",
            answer: "Once you find a suitable property: 1. Click 'Request to Book' on the listing 2. Fill out the required information 3. Wait for landlord approval 4. Complete the payment process when approved"
          },
          {
            question: "What payment methods are accepted?",
            answer: "We accept major credit/debit cards and bank transfers. All payments are processed securely through our platform."
          }
        ]
      }
    ],
    landlords: [
      {
        category: "Listing Properties",
        items: [
          {
            question: "How do I list my property?",
            answer: "To list your property: 1. Create a landlord account 2. Click 'Add Property' 3. Fill in property details and upload photos 4. Submit required documentation 5. Wait for verification 6. Publish your listing"
          },
          {
            question: "What documents do I need to list my property?",
            answer: "Required documents include: Proof of ownership, Safety certificates, Insurance documentation, Property license (if applicable), Government-issued ID"
          }
        ]
      },
      {
        category: "Managing Bookings",
        items: [
          {
            question: "How do I manage booking requests?",
            answer: "Access your dashboard to: View booking requests, Accept or decline requests, Message potential tenants, Manage current tenancies"
          },
          {
            question: "When and how do I receive payments?",
            answer: "Payments are processed automatically through our platform and transferred to your registered bank account within 24-48 hours of booking confirmation."
          }
        ]
      }
    ]
  };

  const filterFAQs = (items) => {
    if (!searchQuery) return items;
    return items.filter(category => 
      category.items.some(item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white mt-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 text-blue-900">How can we help you?</h1>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
          <input
            type="text"
            placeholder="Search FAQs..."
            className="w-full px-10 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-8">
        <div className="grid grid-cols-2 gap-2 p-1 bg-blue-50 rounded-lg">
          <button
            className={`py-2 px-4 rounded-md transition-colors ${
              activeTab === 'students'
                ? 'bg-white shadow-sm text-blue-600'
                : 'hover:bg-blue-100 text-blue-800'
            }`}
            onClick={() => setActiveTab('students')}
          >
            For Students
          </button>
          <button
            className={`py-2 px-4 rounded-md transition-colors ${
              activeTab === 'landlords'
                ? 'bg-white shadow-sm text-blue-600'
                : 'hover:bg-blue-100 text-blue-800'
            }`}
            onClick={() => setActiveTab('landlords')}
          >
            For Landlords
          </button>
        </div>
      </div>

      <div>
        {filterFAQs(faqData[activeTab]).map((category, idx) => (
          <div key={idx} className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">{category.category}</h2>
            <CustomAccordion items={category.items} />
          </div>
        ))}
      </div>

      <div className="text-center mt-8 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-blue-900">Still need help?</h3>
        <p className="text-blue-800">
          Contact our support team at <span className="text-blue-600">support@uinstay.com</span> or visit our detailed help center.
        </p>
      </div>
    </div>
  );
};

export default FAQSection