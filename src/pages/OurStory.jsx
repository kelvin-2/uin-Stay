import React from "react";
import { ShieldCheck, GraduationCap, Home } from "lucide-react";

function OurStory() {
  console.log('Rendering OurStory');
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="w-full relative bg-blue-600 h-[400px]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/95 to-blue-800/95">
          <img 
            src="/api/placeholder/1920/400" 
            alt="Students studying"
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Story
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Creating a safer, simpler way for students to find their perfect home away from home.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <ShieldCheck className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Safe & Verified</h3>
            <p className="text-gray-600">
              Every listing is thoroughly verified to ensure your safety and peace of mind.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <GraduationCap className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Student-Focused</h3>
            <p className="text-gray-600">
              Tailored specifically for students' unique needs and requirements.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <Home className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Affordable Housing</h3>
            <p className="text-gray-600">
              Access to quality accommodation that fits student budgets.
            </p>
          </div>
        </div>

        {/* Main Story Content */}
        <div className="max-w-3xl mx-auto space-y-6 text-gray-600">
          <p>
            At UniStay, we understand the challenges students face when looking for reliable accommodation, 
            especially when living far from campus. As a student myself, I realized how stressful and 
            time-consuming it can be to sift through countless unreliable listings, navigate untrustworthy 
            platforms, and risk falling victim to scams.
          </p>

          <p>
            This inspired me to create UniStay—a platform designed specifically to simplify the accommodation 
            search process for students. Our mission is to make finding safe, verified, and affordable student 
            housing as seamless as possible.
          </p>

          <p>
            By eliminating the need to rely on scattered, unregulated sources like social media, UniStay ensures 
            students can focus on their studies while we handle the hard work.
          </p>

          <p>
            UniStay is more than just a platform; it's a trusted companion in your academic journey. We're here 
            to connect students with landlords who understand their needs, ensuring everyone has access to a 
            secure and stress-free living experience.
          </p>

          {/* Closing Statement */}
          <div className="bg-blue-50 p-8 rounded-xl mt-12">
            <p className="text-blue-900 font-medium text-lg">
              Welcome to UniStay—where finding a home away from home is simple, secure, and student-focused.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 w-full py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Happy Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Verified Properties</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Partner Universities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OurStory;