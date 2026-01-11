import React, { useState } from "react";

function Benefits() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const benefits = [
    {
      title: "Verified Properties",
      description: "All our properties are thoroughly verified for your peace of mind.",
      icon: "🏠",
      gradient: "from-blue-500 to-cyan-500",
      bgGlow: "group-hover:shadow-blue-500/50"
    },
    {
      title: "Student-Focused",
      description: "Properties selected specifically for students' needs and budgets.",
      icon: "👨‍🎓",
      gradient: "from-purple-500 to-pink-500",
      bgGlow: "group-hover:shadow-purple-500/50"
    },
    {
      title: "Easy Booking",
      description: "Simple and straightforward process to secure your accommodation.",
      icon: "✅",
      gradient: "from-emerald-500 to-teal-500",
      bgGlow: "group-hover:shadow-emerald-500/50"
    }
  ];

  return (
    <section className="w-full py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block">
            <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 uppercase tracking-wider mb-2 block">
              Benefits
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose UniStay?
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto"></div>
          </div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            We make finding your perfect student accommodation simple, safe, and stress-free
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${benefit.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
              
              {/* Card */}
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                {/* Icon container with gradient background */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${benefit.gradient} mb-6 transform transition-transform duration-300 ${hoveredIndex === index ? 'scale-110 rotate-6' : ''}`}>
                  <span className="text-3xl filter drop-shadow-lg">{benefit.icon}</span>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>

                {/* Animated bottom accent */}
                <div className={`h-1 bg-gradient-to-r ${benefit.gradient} rounded-full mt-6 transition-all duration-300 ${hoveredIndex === index ? 'w-full' : 'w-0'}`}></div>

                {/* Corner decoration */}
                <div className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}

export default Benefits;