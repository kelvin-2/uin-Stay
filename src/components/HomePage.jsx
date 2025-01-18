import React from "react";
import { Link } from "react-router-dom";
import SearchBox from './SearchBox';
import Properties from './Properties';
import { Building2, GraduationCap, Home, Users } from 'lucide-react';
import '../styles/homepage.css'

function HomePage() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl bg-gradient-to-r from-blue-600 to-indigo-600 inline-block text-transparent bg-clip-text">
              Welcome to UniStay
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Find your perfect student accommodation easily. Join thousands of students who've found their ideal home away from home.
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="relative -mt-10 mb-10">
        <div className="mx-auto max-w-4xl">
          <div className="bg-white rounded-xl shadow-xl p-4">
            <SearchBox />
          </div>
        </div>
      </div>

      {/* Featured Properties Section */}
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
          <Link 
            to="/properties" 
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 cursor-pointer"
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
      <div className="benefitsSection max-w-7xl mx-auto">
        <div>
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
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow ">
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