// components/HeroSection.jsx
import React from "react";

function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-white">
    <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 ">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl bg-gradient-to-r from-blue-600 to-indigo-600 inline-block text-transparent bg-clip-text">
          Welcome to UniStay
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          Find your perfect student accommodation easily. Join thousands of students who've found their ideal home away from home.
        </p>
        
        {/* Stats Section  */}
        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 max-w-4xl mx-auto">
          {[
            { icon: Building2, label: "Properties", value: "500+" },
            { icon: Users, label: "Happy Students", value: "2000+" },
            { icon: Home, label: "Cities", value: "4" },
            { icon: GraduationCap, label: "Universities", value: "10+" },
          ].map((stat, index) => (
            <div key={index} className="flex flex-col items-center p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
              <stat.icon className="w-8 h-8 text-blue-600 mb-2" />
              <div className="font-semibold text-2xl text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
       
      </div>
    </div>
  </div>
  );
}

export default HeroSection;
