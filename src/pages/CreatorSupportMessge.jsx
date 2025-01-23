import React from 'react';
import { 
  Heart, 
  DollarSign, 
  Code, 
  University, 
  User 
} from 'lucide-react';

const CreatorSupportMessage = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-8 text-center">
          <User className="mx-auto w-16 h-16 mb-4 text-white" />
          <h1 className="text-4xl font-bold mb-4">Support uinStay</h1>
          <h2 className="text-2xl">A Message From the Creator</h2>
        </div>

        {/* Creator's Story */}
        <div className="p-8">
          <div className="flex items-center mb-6">
            <Code className="w-8 h-8 mr-4 text-blue-500" />
            <h3 className="text-2xl font-semibold">My Journey</h3>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            Hi, I'm [Your Name], a final-year Computer Science student with a passion for creating solutions that make life easier for others. uinStay started as a personal project to help students like me find affordable housing during university.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Balancing my studies and building this platform has been a rewarding journey, but it comes with challenges. As a solo developer, I'm also managing the costs of tuition, hosting, and maintaining uinStay.
          </p>
        </div>

        {/* Why Support Matters */}
        <div className="bg-gray-100 p-8">
          <div className="flex items-center mb-6">
            <Heart className="w-8 h-8 mr-4 text-red-500" />
            <h3 className="text-2xl font-semibold">Why Your Support Matters</h3>
          </div>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center">
              <University className="w-5 h-5 mr-3 text-blue-500" />
              Keep uinStay free for all students
            </li>
            <li className="flex items-center">
              <DollarSign className="w-5 h-5 mr-3 text-green-500" />
              Cover my university tuition fees so I can focus on studies and the platform
            </li>
            <li className="flex items-center">
              <Code className="w-5 h-5 mr-3 text-purple-500" />
              Add new features and grow uinStay into an even better resource
            </li>
          </ul>
        </div>

        {/* Donation Options */}
        <div className="p-8 text-center">
          <h3 className="text-2xl font-semibold mb-6">How You Can Help</h3>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              One-Time Support
            </button>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
              Monthly Support
            </button>
          </div>
        </div>

        {/* Impact Statement */}
        <div className="bg-gray-200 p-8 text-center">
          <p className="text-gray-700 text-lg">
            By supporting uinStay, you're not just helping a fellow student—you're helping students everywhere access a free, reliable platform.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatorSupportMessage;