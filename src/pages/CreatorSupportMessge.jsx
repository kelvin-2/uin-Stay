import React from 'react';
import { Heart, DollarSign, Code, University, User, Coffee, Gift, ArrowRight, Mail, Phone } from 'lucide-react';

const CreatorSupportMessage= () => {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
        {/* Header - Keeping as is since it's perfect */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,_#ffffff33_25%,_transparent_25%,_transparent_50%,_#ffffff33_50%,_#ffffff33_75%,_transparent_75%,_transparent)] bg-[length:64px_64px]"></div>
          </div>
          <User className="mx-auto w-20 h-20 mb-6 text-white bg-white/10 p-4 rounded-full" />
          <h1 className="text-5xl font-bold mb-4">Support uinStay</h1>
          <p className="text-xl text-blue-100">Help Make Student Housing Accessible</p>
        </div>

        {/* Journey Section with enhanced design */}
        <div className="p-8 lg:p-12 bg-gradient-to-br from-white to-blue-50">
          <div className="flex items-center mb-8">
            <div className="bg-blue-100 p-3 rounded-full mr-4 shadow-md">
              <Code className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800">My Journey</h3>
          </div>
          <div className="space-y-6 text-gray-600 leading-relaxed max-w-3xl mx-auto">
            <p className="text-lg">uinStay was created to make finding university accommodation easier and completely free for students. This platform is built with passion and dedication, ensuring that students don't have to pay anything to access valuable resources.</p>
            <p className="text-lg">As a final-year Computer Science student, I have invested my time and skills into developing and maintaining uinStay. Your donations will help cover my university fees, allowing me to keep uinStay running and free for all students.</p>
          </div>
        </div>

        {/* Donation Section with cards */}
        <div className="p-8 lg:p-12 bg-gray-50">
          <h3 className="text-3xl font-bold mb-10 text-center text-gray-800">How to Donate</h3>
        
          <div className="space-y-6 mb-10 text-gray-600 leading-relaxed max-w-3xl mx-auto">
            <p className="text-lg">You can contribute directly to my university account to help cover my tuition fees:.</p>
          </div>
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <DollarSign className="w-8 h-8 text-blue-600 mr-3" />
                <h4 className="text-2xl font-semibold">International Payments</h4>
              </div>
              <div className="grid gap-4 text-gray-700 divide-y">
                {[
                  ["Account Name", "Nelson Mandela University – Main"],
                  ["Bank Name", "Standard Bank"],
                  ["Bank Address", "Rink Street, Port Elizabeth, South Africa"],
                  ["Account Number", "080263011"],
                  ["Bank Swift Code", "SBZA ZAJJ"],
                  ["Internet Banking Code", "051001"],
                  ["Reference", "225047357"]
                ].map(([label, value]) => (
                  <div key={label} className="py-3 flex flex-col sm:flex-row sm:justify-between">
                    <strong className="text-gray-900">{label}:</strong>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
                <div className="pt-4">
                  <strong>Email copy of deposit to: </strong>
                  <a href="mailto:intfees@mandela.ac.za" className="text-blue-600 hover:text-blue-800 transition-colors">intfees@mandela.ac.za</a>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <University className="w-8 h-8 text-blue-600 mr-3" />
                <h4 className="text-2xl font-semibold">Local Payments</h4>
              </div>
              <div className="grid gap-4 text-gray-700 divide-y">
                {[
                  ["Account Name", "Nelson Mandela University – Main"],
                  ["Bank Name", "Standard Bank"],
                  ["Bank Address", "Rink Street, Port Elizabeth, South Africa"],
                  ["Account Number", "080265855"],
                  ["Internet Banking Code", "050417"],
                  ["Reference", "225047357"]
                ].map(([label, value]) => (
                  <div key={label} className="py-3 flex flex-col sm:flex-row sm:justify-between">
                    <strong className="text-gray-900">{label}:</strong>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
                <div className="pt-4">
                  <strong>Email copy of deposit to: </strong>
                  <a href="mailto:intfees@mandela.ac.za" className="text-blue-600 hover:text-blue-800 transition-colors">intfees@mandela.ac.za</a>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <p className="text-lg font-semibold text-gray-800 mb-2"> Please also send proof of payment to my email:</p>
              <a href="mailto:tkmudzingwa21@gmail.com" className="text-blue-600 hover:text-blue-800 transition-colors text-lg">tkmudzingwa21@gmail.com</a>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <Coffee className="w-8 h-8 text-blue-600 mr-3" />
                <h4 className="text-2xl font-semibold">Buy Me a Coffee </h4>
              </div>
              <p className="text-gray-700 mb-6">If you'd like to support me directly for coffee, internet, or maintaining uinStay, I truly appreciate it! Since I don't have a payment gateway yet, please contact me for direct donation options:</p>
              <div className="space-y-4 text-lg">
                <div className="flex items-center justify-center gap-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <a href="mailto:tkmudzingwa21@gmail.com" className="text-blue-600 hover:text-blue-800 transition-colors">tkmudzingwa21@gmail.com</a>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <Phone className="w-6 h-6 text-blue-600" />
                  <a href="tel:+27639604148" className="text-blue-600 hover:text-blue-800 transition-colors">+27 63 960 4148</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Future Goals with enhanced cards */}
        <div className="p-8 lg:p-12 bg-gradient-to-br from-gray-50 to-blue-50">
          <h3 className="text-3xl font-bold mb-10 text-center text-gray-800">What Your Support Will Enable</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 p-3 rounded-xl inline-block mb-4">
                <Gift className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">New Features</h4>
              <p className="text-gray-600">Virtual tours, AI-powered matching, and enhanced search filters</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 p-3 rounded-xl inline-block mb-4">
                <University className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">More Universities</h4>
              <p className="text-gray-600">Expanding coverage to help more students nationwide</p>
            </div>
          </div>
        </div>

        <div className="p-12 text-center bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <p className="text-2xl font-medium mb-8 max-w-2xl mx-auto">
            Your support keeps uinStay free and accessible for students everywhere.
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
            Make a Difference Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatorSupportMessage;