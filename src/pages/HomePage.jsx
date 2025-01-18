import React from "react";
import { Link } from "react-router-dom";
import SearchBox from './SearchBox';
import Properties from './Properties';
import { Building2, GraduationCap, Home, Users } from 'lucide-react';


function HomePage() {
  return (
    <div className="w-full mx-auto ">
      {/* Search Section */}
      <div className="relative -mt-10 mb-10">
        <div className="mx-auto max-w-4xl px-4">
          <div className="bg-white rounded-xl shadow-xl p-4">
            <SearchBox />
          </div>
        </div>
      </div>

      {/* Featured Properties Section */}
      <div className="w-full  ">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
          <Link 
            to="/properties" 
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            View all properties
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <Properties />
      </div>

      {/* Benefits Section */}
      <div className="bg-blue-50 py-16 w-full">
        <div className="px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose UniStay?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Verified Properties",
                description: "All our properties are thoroughly verified for your peace of mind."
              },
              {
                title: "Student-Focused",
                description: "Properties selected specifically for students' needs and budgets."
              },
              {
                title: "Easy Booking",
                description: "Simple and straightforward process to secure your accommodation."
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;