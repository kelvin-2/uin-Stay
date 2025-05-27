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
        category: "Using UniStay",
        items: [
          {
            question: "What is UniStay?",
            answer: "UniStay is a platform that helps students discover verified accommodation options near their university. We're starting small, so features will grow over time!"
          },
          {
            question: "Do I need to create an account?",
            answer: "Currently, you can browse accommodation listings without creating an account. In the future, we'll introduce user accounts for saving listings and messaging landlords."
          },
          {
            question: "How do I find accommodation?",
            answer: "Use the search bar and filters to browse properties by location, type, or amenities. If something looks good, you can view the details and contact the landlord."
          }
        ]
      },
      {
        category: "Contacting Landlords",
        items: [
          {
            question: "Can I contact the landlord through UniStay?",
            answer: "Yes. For now, listings include the landlord's contact email or phone number. We're working on adding in-app messaging soon!"
          },
          {
            question: "Are the landlords verified?",
            answer: "We manually review all landlord submissions to ensure listings are legitimate. However, we recommend you do your own checks before making any agreements."
          }
        ]
      },
      {
        category: "Future Features",
        items: [
          {
            question: "Will I be able to book rooms through the platform?",
            answer: "Not yet. We're working on this feature! For now, you can reach out to landlords directly to arrange a visit or booking."
          },
          {
            question: "Will UniStay handle payments in the future?",
            answer: "Eventually, yes — but not right now. At this MVP stage, all payments are handled offline directly between students and landlords."
          }
        ]
      }
    ],
    landlords: [
      {
        category: "Getting Started",
        items: [
          {
            question: "How do I list my property?",
            answer: "Click on 'Add Property' from the home page, fill in your property details, and submit your listing. We’ll review it and publish it if it meets our guidelines."
          },
          {
            question: "Is there a cost to list a property?",
            answer: "No. Listing your property on UniStay is free during our MVP stage."
          }
        ]
      },
      {
        category: "Managing Your Listing",
        items: [
          {
            question: "Can I edit my listing after submitting?",
            answer: "Yes, you can request edits by contacting us directly. We'll soon be adding a dashboard where you can manage listings yourself."
          },
          {
            question: "How do I remove my property if it’s no longer available?",
            answer: "Please email us at support@uinstay.com, and we’ll remove your listing within 24 hours."
          }
        ]
      },
      {
        category: "Looking Ahead",
        items: [
          {
            question: "Will I be able to message students through UniStay?",
            answer: "We’re building this feature! For now, students will contact you via the email or phone number you provide."
          },
          {
            question: "Are tenant payments handled by UniStay?",
            answer: "Not at this time. All rental agreements and payments are made outside the platform between you and the student."
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
          Contact our support team at <span className="text-blue-600">support@uinstay.co.za</span> or visit our detailed help center.
        </p>
      </div>
    </div>
  );
};

export default FAQSection