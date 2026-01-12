import React from "react";
import { Building2, Users, Home, GraduationCap } from "lucide-react";

function HeroSection() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      {/* Glassmorphism container */}
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <div className="backdrop-blur-sm bg-white/30 rounded-3xl shadow-xl border border-white/40 p-12 md:p-16">
          <div className="text-center">
           <h1 
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight"
              style={{ letterSpacing: '-0.02em' }}
            >
              Student Accommodation in{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 inline-block text-transparent bg-clip-text relative">
                Port Elizabeth
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                  <path d="M0,7 Q25,3 50,5 T100,7" fill="none" stroke="url(#gradient)" strokeWidth="2" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="#4f46e5" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>
            <p className="mt-8 text-lg leading-relaxed text-gray-600 max-w-[680px] mx-auto" style={{ lineHeight: '1.7' }}>
              Find affordable student housing and accommodation in Port Elizabeth. 
              Browse verified apartments, shared rooms, and student residences near Nelson Mandela University (NMU), PE College, Rosebank College.
              Book your perfect student home today with UniStay.
            </p>
            {/* Schema.org structured data for SEO */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "RealEstateAgent",
                  "name": "UniStay",
                  "description": "Student accommodation platform in Port Elizabeth, South Africa",
                  "url": "https://unistay.com",
                  "areaServed": {
                    "@type": "City",
                    "name": "Port Elizabeth",
                    "addressCountry": "ZA"
                  },
                  "serviceType": "Student Accommodation",
                  "priceRange": "$$"
                })
              }}
            />
            
            {/* Call-to-action section */}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button 
                className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                aria-label="Search for student accommodation in Port Elizabeth"
              >
                Find Accommodation
              </button>
            </div>

            {/* Trust signals row */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Verified Properties</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">NSFAS Friendly</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-indigo-600" />
                  <span className="font-medium">No Booking Fees</span>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            {/* <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4 max-w-4xl mx-auto">
              {[
                { icon: Building2, label: "Properties", value: "500+" },
                { icon: Users, label: "Happy Students", value: "2000+" },
                { icon: Home, label: "Cities", value: "4" },
                { icon: GraduationCap, label: "Universities", value: "10+" },
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center p-6 rounded-2xl backdrop-blur-sm bg-white/40 border border-white/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <stat.icon className="w-8 h-8 text-blue-600 mb-2" />
                  <div className="font-bold text-3xl text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-700 font-medium">{stat.label}</div>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;