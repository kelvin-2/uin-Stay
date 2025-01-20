import React, { useEffect } from "react";
import HeroSection from "../components/HeroOurStory";

function OurStory() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />

      {/* Why We Started Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 mb-6">Why We Started</h2>
            <p className="text-lg text-zinc-600 mb-4">
              We recognized a critical challenge in student life: finding safe, affordable 
              housing should never be a cause for stress or anxiety. As former students 
              ourselves, we felt this pain point firsthand, and we knew there had to be 
              a better way.
            </p>
            <p className="text-lg text-zinc-600">
              That's why we're building a platform that redefines how students find 
              housing—making it transparent, secure, and effortless. Every student 
              deserves a place that feels like home, and we're here to make that happen.
            </p>
          </div>
          <div className="bg-zinc-100 h-64 rounded-lg"></div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-900 mb-12 text-center">
            Our Commitment
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-zinc-100 rounded-full mb-6"></div>
              <h3 className="text-xl font-semibold text-zinc-800 mb-4">
                Safety First
              </h3>
              <p className="text-zinc-600">
                We verify each listing thoroughly to ensure students have access to 
                safe, reliable housing options they can trust.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-zinc-100 rounded-full mb-6"></div>
              <h3 className="text-xl font-semibold text-zinc-800 mb-4">
                Full Transparency
              </h3>
              <p className="text-zinc-600">
                Clear, honest information about every property, with upfront pricing 
                and no hidden surprises.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-zinc-100 rounded-full mb-6"></div>
              <h3 className="text-xl font-semibold text-zinc-800 mb-4">
                Student-First Approach
              </h3>
              <p className="text-zinc-600">
                Every feature we develop is designed to address real student needs 
                and make their housing search easier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Looking Forward Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-zinc-900 mb-6">
            Looking Forward
          </h2>
          <p className="text-lg text-zinc-600 mb-8">
            We're at the beginning of our journey to transform student housing. Our 
            vision extends beyond just listing properties - we're building a community 
            where students can find their ideal living space with confidence and ease.
          </p>
          <p className="text-lg text-zinc-600">
            Join us as we work to make student housing search better for everyone. 
            Your perfect student home is out there, and we're here to help you find it.
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Home?</h2>
          <p className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto">
            Start your journey to finding the ideal student accommodation today. 
            Browse listings, connect with verified landlords, and make your university 
            experience unforgettable.
          </p>
          <button className="bg-white text-zinc-900 px-8 py-3 rounded-lg font-semibold hover:bg-zinc-100 transition-colors">
            Start Searching
          </button>
        </div>
      </section>
    </div>
  );
}

export default OurStory;