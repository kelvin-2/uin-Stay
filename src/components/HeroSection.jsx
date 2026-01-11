import React from "react";

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white" aria-labelledby="hero-heading">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
        <div className="text-center">
          <h1 
            id="hero-heading"
            className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl bg-gradient-to-r from-blue-600 to-indigo-600 inline-block text-transparent bg-clip-text"
          >
            Student Accommodation Port Elizabirth 
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
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
          
          {/* Call-to-action section for better user engagement */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button 
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200"
              aria-label="Search for student accommodation in Port Elizabeth"
            >
              Find Accommodation
            </button>
            {/* <button 
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors duration-200"
              aria-label="Learn more about UniStay student housing services"
            >
              Learn more <span aria-hidden="true">→</span>
            </button> */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;





 {/* Stats Section  */}
        {/* <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4 max-w-4xl mx-auto">
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
        </div> */}