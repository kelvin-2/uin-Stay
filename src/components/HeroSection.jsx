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
        The easiest way to find verified student accommodation in Port Elizabeth. Safe, affordable, and trusted by thousands of students.
        </p>
        
      </div>
    </div>
  </div>
  );
}

export default HeroSection;
