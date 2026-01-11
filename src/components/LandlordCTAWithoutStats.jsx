import React from 'react';
import { Building2 } from 'lucide-react';

function LandlordCTA() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 md:p-16 text-center overflow-hidden shadow-2xl">
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2RvdHMpIi8+PC9zdmc+')] opacity-40"></div>
          
          {/* Floating Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Animated Icon */}
            <div className="inline-block mb-6 animate-bounce">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <Building2 className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-[fadeInUp_0.6s_ease-out]">
              Are You a Landlord?
            </h2>
            
            <p className="text-xl text-white/95 mb-8 max-w-2xl mx-auto leading-relaxed animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
              Join hundreds of property owners in Port Elizabeth connecting with students. 
              List your properties near NMU and other campuses to reach verified student tenants today.
            </p>
            
            {/* CTA Button */}
            <button 
              className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3 animate-[fadeInUp_0.6s_ease-out_0.4s_both] group"
              aria-label="List your property with UniStay"
            >
              <Building2 className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              List Your Property With Us
            </button>
            
            {/* Subtext */}
            <div className="mt-6 animate-[fadeInUp_0.6s_ease-out_0.6s_both]">
              <p className="text-white/90 text-base font-medium mb-2">
                ✨ Special Offer for New Landlords
              </p>
              <p className="text-white/80 text-sm">
                No commission for the first 3 months!
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

export default LandlordCTA;