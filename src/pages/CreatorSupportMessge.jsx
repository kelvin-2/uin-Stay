import React from 'react';
import { 
  Heart, 
  DollarSign, 
  Code, 
  University, 
  User,
  Star,
  Coffee,
  Gift,
  ArrowRight
} from 'lucide-react';

const CreatorSupportMessage = () => {
  const supportTiers = [
    {
      name: "Coffee",
      icon: <Coffee className="w-6 h-6 text-orange-400" />,
      description: "Buy me a coffee to keep me coding",
      
      color: "bg-orange-500"
    },
    {
      name: "Student",
      icon: <University className="w-6 h-6 text-blue-400" />,
      description: "Help cover my student expenses",
      
      color: "bg-blue-500"
    },
    {
      name: "Supporter",
      icon: <Star className="w-6 h-6 text-purple-400" />,
      description: "Support platform development",
     
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,_#ffffff33_25%,_transparent_25%,_transparent_50%,_#ffffff33_50%,_#ffffff33_75%,_transparent_75%,_transparent)] bg-[length:64px_64px]"></div>
          </div>
          <User className="mx-auto w-20 h-20 mb-6 text-white bg-white/10 p-4 rounded-full" />
          <h1 className="text-5xl font-bold mb-4">Support uinStay</h1>
          <p className="text-xl text-blue-100">Help Make Student Housing Accessible</p>
        </div>

        {/* Creator's Story */}
        <div className="p-8 lg:p-12">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Code className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">My Journey</h3>
          </div>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p className="text-lg">
              Hi, I'm Kelvin, a final-year Computer Science student passionate about creating positive change through technology. uinStay emerged from my personal experience with the challenges of finding student housing.
            </p>
            <p className="text-lg">
              What started as a solution to my own problem has grown into a platform helping thousands of students find their perfect home away from home. Every line of code is written with the goal of making the housing search process simpler and more accessible.
            </p>
          </div>
        </div>

        {/* Impact Stats 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-gray-50">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-2">1,000+</div>
            <div className="text-gray-600">Students Housed</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
            <div className="text-gray-600">Universities Covered</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-gray-600">Platform Availability</div>
          </div>
  </div>*/}

        {/* Support Tiers */}
        <div className="p-8 lg:p-12">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">Choose Your Impact Level</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportTiers.map((tier, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gray-100 p-3 rounded-full">{tier.icon}</div>
                  <span className="text-2xl font-bold text-gray-800">{tier.amount}</span>
                </div>
                <h4 className="text-xl font-semibold mb-2">{tier.name}</h4>
                <p className="text-gray-600 mb-4">{tier.description}</p>
                <button className={`w-full ${tier.color} text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2`}>
                  <span>Support</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Future Goals */}
        <div className="bg-gray-50 p-8 lg:p-12">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">What Your Support Will Enable</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <Gift className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">New Features</h4>
                <p className="text-gray-600">Virtual tours, AI-powered matching, and enhanced search filters</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <University className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">More Universities</h4>
                <p className="text-gray-600">Expanding coverage to help more students nationwide</p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="p-8 text-center bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <p className="text-xl mb-6">
            Your support keeps uinStay free and accessible for students everywhere.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
            Make a Difference Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatorSupportMessage;