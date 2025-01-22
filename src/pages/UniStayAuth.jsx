import React, { useState } from 'react';
import { Building, User, Mail, Lock, Home, BookOpen, Phone, MapPin } from 'lucide-react';

const UniStayAuth = () => {
  const [userType, setUserType] = useState('student');
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 w-full">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg border border-blue-100">
        {/* Header */}
        <div className="p-6 space-y-2 text-center border-b border-gray-100">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-500/10 p-3 rounded-full">
              <Home className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-blue-900">Welcome to UniStay</h2>
          <p className="text-blue-600">Your gateway to student accommodation</p>
        </div>

        <div className="p-6 space-y-4">
          {/* User Type Selection */}
          <div className="flex gap-4 justify-center mb-6">
            <button
              onClick={() => setUserType('student')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                userType === 'student'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'border border-gray-300 hover:bg-blue-50'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Student
            </button>
            <button
              onClick={() => setUserType('landlord')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                userType === 'landlord'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'border border-gray-300 hover:bg-blue-50'
              }`}
            >
              <Building className="h-4 w-4" />
              Landlord
            </button>
          </div>

          {/* Tabs */}
          <div className="w-full">
            <div className="flex rounded-lg bg-blue-50 p-1">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
                  activeTab === 'login' ? 'bg-blue-600 text-white' : 'text-blue-600'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
                  activeTab === 'signup' ? 'bg-blue-600 text-white' : 'text-blue-600'
                }`}
              >
                Sign up
              </button>
            </div>

            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-blue-900">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                    <input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-blue-900">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                    <input
                      id="password"
                      type="password"
                      className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-blue-900">
                    <input
                      type="checkbox"
                      className="rounded border-blue-300 text-blue-600 focus:ring-blue-400"
                    />
                    Remember me
                  </label>
                  <a href="#" className="text-blue-600 hover:text-blue-800">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>
            )}

            {/* Signup Form */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label htmlFor="full-name" className="block text-sm font-medium text-blue-900">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                    <input
                      id="full-name"
                      type="text"
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="signup-email" className="block text-sm font-medium text-blue-900">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                    <input
                      id="signup-email"
                      type="email"
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                  </div>
                </div>

                {userType === 'student' && (
                  <div className="space-y-2">
                    <label htmlFor="university" className="block text-sm font-medium text-blue-900">
                      University
                    </label>
                    <div className="relative">
                      <BookOpen className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                      <input
                        id="university"
                        type="text"
                        placeholder="Your University"
                        className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                      />
                    </div>
                  </div>
                )}

                {userType === 'landlord' && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-blue-900">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                        <input
                          id="phone"
                          type="tel"
                          placeholder="+44 123 456 7890"
                          className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="location" className="block text-sm font-medium text-blue-900">
                        Primary Location
                      </label>
                      <div className="relative">
                        <MapPin className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                        <input
                          id="location"
                          type="text"
                          placeholder="City"
                          className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label htmlFor="signup-password" className="block text-sm font-medium text-blue-900">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                    <input
                      id="signup-password"
                      type="password"
                      className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="text-sm text-blue-900">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      required
                      className="rounded border-blue-300 text-blue-600 focus:ring-blue-400"
                    />
                    I agree to the Terms of Service and Privacy Policy
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 text-center text-sm text-blue-600">
          {userType === 'student'
            ? "Find your perfect student home"
            : "List your properties to thousands of students"
          }
        </div>
      </div>
    </div>
  );
};

export default UniStayAuth;