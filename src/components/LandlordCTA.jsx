import React, { useState, useEffect } from 'react';
import { Building2, TrendingUp, Users, Award } from 'lucide-react';
import { publicStats } from '../api/statsApi';
import { Link } from 'react-router-dom';

function LandlordCTA() {
  const [stats, setStats] = useState({
    activeListings: 0,
    studentUsers: 0,
    propertyOwners: 0,
    occupancyRate: 0,
    avgResponseTime: "0h"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await publicStats();
        if (response.success && response.stats) {
          setStats(response.stats);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Optionally set fallback values on error
        setStats({
          activeListings: 0,
          studentUsers: 0,
          propertyOwners: 0,
          occupancyRate: 95,
          avgResponseTime: "24h"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 mt-12 sm:mt-16 md:mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Card with Glassmorphism */}
        <div className="bg-white/30 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            
            {/* Left Side - Content */}
            <div className="p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 w-fit border border-blue-300/30">
                <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                For Property Owners
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                List Your Property<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Reach More Students</span>
              </h2>
              
              <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 leading-relaxed">
                Join hundreds of property owners in Port Elizabeth. Connect with verified students looking for accommodation near NMU, PE College, and Rosebank College.
              </p>
              
              {/* Benefits List */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full p-1.5 sm:p-2 mt-0.5 sm:mt-1 shadow-lg flex-shrink-0">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-0.5 sm:mb-1 text-sm sm:text-base">Maximize Occupancy</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">Fill vacancies faster with our active student community</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-full p-1.5 sm:p-2 mt-0.5 sm:mt-1 shadow-lg flex-shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-0.5 sm:mb-1 text-sm sm:text-base">Verified Tenants</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">All students are verified with valid enrollment</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full p-1.5 sm:p-2 mt-0.5 sm:mt-1 shadow-lg flex-shrink-0">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-0.5 sm:mb-1 text-sm sm:text-base">Easy Management</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">Simple dashboard to manage listings and bookings</p>
                  </div>
                </div>
              </div>
              
              {/* CTA Button */}
              <Link to="/signin" className="w-full sm:w-auto">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 inline-flex items-center justify-center gap-2 group w-full">
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                  List Your Property Now
                </button>
              </Link>
              
             {/* <div className="mt-6 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-300/30">
                <p className="text-gray-900 font-semibold text-center">
                  🎉 Special Launch Offer: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">No Commission for 6 Months!</span>
                </p>
              </div> */} {/* Special Offer with Glassmorphism */}
              
            </div>
            
            {/* Right Side - Stats & Visual with Enhanced Glassmorphism */}
            <div className="bg-gradient-to-br from-blue-600/90 to-indigo-600/90 backdrop-blur-xl p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center text-white relative overflow-hidden">
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-indigo-400/20 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Join Our Growing Network</h3>
                
                {/* Stats Grid with Glassmorphism */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
                  <div className="bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/30 hover:bg-white/25 transition-all duration-300 hover:scale-105 active:scale-95">
                    <div className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 transition-all duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                      {stats.activeListings}+
                    </div>
                    <div className="text-white/90 text-xs sm:text-sm">Active Listings</div>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/30 hover:bg-white/25 transition-all duration-300 hover:scale-105 active:scale-95">
                    <div className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 transition-all duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                      {stats.studentUsers}+
                    </div>
                    <div className="text-white/90 text-xs sm:text-sm">Student Users</div>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/30 hover:bg-white/25 transition-all duration-300 hover:scale-105 active:scale-95">
                    <div className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 transition-all duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                      {stats.propertyOwners}+
                    </div>
                    <div className="text-white/90 text-xs sm:text-sm">Property Owners</div>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/30 hover:bg-white/25 transition-all duration-300 hover:scale-105 active:scale-95">
                    <div className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 transition-all duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                      {stats.avgResponseTime}
                    </div>
                    <div className="text-white/90 text-xs sm:text-sm">Avg. Response</div>
                  </div>
                </div>
                
                {/* Testimonial with Glassmorphism */}
                {/* <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 hover:bg-white/25 transition-all duration-300">
                  <p className="text-white/95 italic mb-4">
                    "UniStay helped me fill all my properties within 2 weeks. The platform is easy to use and the students are reliable."
                  </p>
                  <p className="font-semibold">Sarah M.</p>
                  <p className="text-sm text-white/80">Property Owner, Summerstrand</p>
                </div> */}
              </div>
            </div>
            
          </div>
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