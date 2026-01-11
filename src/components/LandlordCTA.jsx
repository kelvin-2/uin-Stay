import React from 'react';
import { Building2, TrendingUp, Users, Award } from 'lucide-react';

function LandlordCTA() {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            
            {/* Left Side - Content */}
            <div className="p-12 md:p-16 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-6 w-fit">
                <Building2 className="w-4 h-4" />
                For Property Owners
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                List Your Property<br />
                <span className="text-blue-600">Reach More Students</span>
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Join hundreds of property owners in Port Elizabeth. Connect with verified students looking for accommodation near NMU, PE College, and Rosebank College.
              </p>
              
              {/* Benefits List */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Maximize Occupancy</h3>
                    <p className="text-gray-600 text-sm">Fill vacancies faster with our active student community</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Verified Tenants</h3>
                    <p className="text-gray-600 text-sm">All students are verified with valid enrollment</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Easy Management</h3>
                    <p className="text-gray-600 text-sm">Simple dashboard to manage listings and bookings</p>
                  </div>
                </div>
              </div>
              
              {/* CTA Button */}
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2 group w-full sm:w-auto">
                <Building2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                List Your Property Now
              </button>
              
              {/* Special Offer */}
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                <p className="text-blue-900 font-semibold text-center">
                  🎉 Special Launch Offer: <span className="text-blue-600">No Commission for 3 Months!</span>
                </p>
              </div>
            </div>
            
            {/* Right Side - Stats & Visual */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-12 md:p-16 flex flex-col justify-center text-white relative overflow-hidden">
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-8">Join Our Growing Network</h3>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-4xl font-bold mb-2">500+</div>
                    <div className="text-white/90 text-sm">Active Listings</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-4xl font-bold mb-2">2000+</div>
                    <div className="text-white/90 text-sm">Student Users</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-4xl font-bold mb-2">95%</div>
                    <div className="text-white/90 text-sm">Occupancy Rate</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="text-4xl font-bold mb-2">24h</div>
                    <div className="text-white/90 text-sm">Avg. Response</div>
                  </div>
                </div>
                
                {/* Testimonial */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <p className="text-white/90 italic mb-4">
                    "UniStay helped me fill all my properties within 2 weeks. The platform is easy to use and the students are reliable."
                  </p>
                  <p className="font-semibold">Sarah M.</p>
                  <p className="text-sm text-white/80">Property Owner, Summerstrand</p>
                </div>
              </div>
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