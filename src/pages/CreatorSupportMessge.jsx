import React from 'react';
import { Heart, Coffee, Zap, Server, Sparkles } from 'lucide-react';

const CreatorSupportMessage = () => {
  return (
    <div className="min-h-screen p-6 md:p-12 flex items-center justify-center">
      {/* Main Container */}
      <div className="max-w-4xl w-full">
        
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 backdrop-blur-xl bg-white/20 rounded-3xl border border-white/30 shadow-2xl mb-6">
            <Coffee className="w-10 h-10 text-purple-700" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 bg-clip-text text-transparent">
            Support the Creator 
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
        </div>

        {/* Main Content Card */}
        <div className="backdrop-blur-xl bg-white/30 rounded-3xl shadow-2xl border border-white/40 overflow-hidden mb-6">
          <div className="p-8 md:p-12">
            {/* Introduction */}
            <div className="mb-8">
              <p className="text-gray-800 text-lg md:text-xl leading-relaxed mb-4">
                Hi, my name is <span className="font-bold text-purple-700">Kelvin Mudzingwa</span>, the creator of <span className="font-bold text-purple-700">UniStay</span> — a platform built to help students find accommodation freely and safely.
              </p>
              <p className="text-gray-800 text-lg md:text-xl leading-relaxed mb-4">
                Everything on this website is <span className="font-bold text-pink-600">100% free</span>, because I believe students shouldn't have to pay just to find a place to stay.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                UniStay is independently built and maintained, from hosting to updates and new features. If you enjoy using the platform and would like to support its growth, you're welcome to make a small donation.
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
              <Heart className="w-6 h-6 text-pink-500 mx-4" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
            </div>

            {/* Support Items */}
            <div className="mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <Sparkles className="w-7 h-7 mr-3 text-purple-600" />
                Your support helps cover:
              </h3>
              
              <div className="space-y-4">
                {/* Item 1 */}
                <div className="backdrop-blur-lg bg-white/40 rounded-2xl p-5 border border-white/50 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 shadow-md">
                      <Server className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg mb-1">Website hosting & maintenance</h4>
                      <p className="text-gray-700">Keeping UniStay online and running smoothly 24/7</p>
                    </div>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="backdrop-blur-lg bg-white/40 rounded-2xl p-5 border border-white/50 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 shadow-md">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg mb-1">Ongoing improvements & new features</h4>
                      <p className="text-gray-700">Continuously enhancing your experience with better tools</p>
                    </div>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="backdrop-blur-lg bg-white/40 rounded-2xl p-5 border border-white/50 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 shadow-md">
                      <Coffee className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg mb-1">The occasional coffee that keeps the code flowing</h4>
                      <p className="text-gray-700">Fueling late-night development sessions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Note */}
            <div className="backdrop-blur-lg bg-gradient-to-r from-purple-100/60 to-pink-100/60 rounded-2xl p-6 border border-purple-200/50 shadow-inner">
              <p className="text-gray-800 text-center text-lg font-medium leading-relaxed">
                Donations are completely <span className="font-bold text-purple-700">optional</span>, but always appreciated. Thank you for being part of the UniStay journey 
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <button className="backdrop-blur-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-pink-500/50 transform hover:-translate-y-1 transition-all duration-300 border border-white/30 flex items-center justify-center">
            <Coffee className="w-6 h-6 mr-2" />
            Buy Me a Coffee
          </button>
          
          <button className="backdrop-blur-xl bg-white/40 hover:bg-white/60 text-purple-700 px-8 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-1 transition-all duration-300 border border-white/50 flex items-center justify-center">
            <Heart className="w-6 h-6 mr-2" />
            Support UniStay
          </button>
        </div>

        {/* Bottom accent */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">Every contribution makes a difference </p>
        </div>
      </div>
    </div>
  );
};

export default CreatorSupportMessage;
