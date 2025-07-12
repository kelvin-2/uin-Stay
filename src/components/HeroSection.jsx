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
            Student Accommodation Port Elizabeth - UniStay
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Find affordable student housing and apartments near universities in Port Elizabeth. Discover quality accommodation options that make your university experience comfortable and convenient.
          </p>
          
          {/* Call-to-Action Buttons */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/properties"
              className="rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
              aria-label="Browse student accommodation in Port Elizabeth"
            >
              Browse Properties
            </a>
            <a
              href="/how-it-works"
              className="text-lg font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
              aria-label="Learn how UniStay student accommodation works"
            >
              How it works <span aria-hidden="true">→</span>
            </a>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 flex items-center justify-center gap-x-8 text-sm text-gray-500">
            <div className="flex items-center gap-x-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              <span>Quality Properties</span>
            </div>
            <div className="flex items-center gap-x-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              <span>Easy Booking</span>
            </div>
            <div className="flex items-center gap-x-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              <span>Student-Focused</span>
            </div>
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