import React, { useState, useEffect } from 'react';
import { Building, User, Mail, Lock, Home, BookOpen, Phone, MapPin, CheckCircle, AlertCircle, X, Eye, EyeOff } from 'lucide-react';

const UniStayAuth = () => {
  const [userType, setUserType] = useState('student');
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    university: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Auto-hide feedback after 5 seconds for better mobile UX
  useEffect(() => {
    if (feedback.message && feedback.type !== 'info') {
      const timer = setTimeout(() => {
        setFeedback({ type: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Clear feedback when switching tabs or user types
  const clearFeedback = () => {
    setFeedback({ type: '', message: '' });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (activeTab === 'signup') {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      }

      if (userType === 'student') {
        if (!formData.university) {
          newErrors.university = 'University is required';
        }
        
        if (!formData.phone) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[0-9]{10,}$/.test(formData.phone)) {
          newErrors.phone = 'Invalid phone number format';
        }
      }

      if (userType === 'landlord') {
        if (!formData.phone) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[0-9]{10,}$/.test(formData.phone)) {
          newErrors.phone = 'Invalid phone number format';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
    // Clear feedback when user starts typing
    if (feedback.message) {
      setFeedback({ type: '', message: '' });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    clearFeedback();
    
    try {
      setFeedback({ type: 'info', message: 'Signing you in...' });
      
      // Simulate login process
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setFeedback({ type: 'success', message: `Welcome back!` });
      
      // Brief delay to show success message
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simulate redirect
      console.log('Redirecting to dashboard...');
      
    } catch (error) {
      console.error("Login error:", error.message);
      setFeedback({ 
        type: 'error', 
        message: error.message || "Login failed. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    clearFeedback();

    try {
      setFeedback({ type: 'info', message: 'Creating your account...' });
      
      // Simulate signup process
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setFeedback({ 
        type: 'success', 
        message: 'Account created successfully! Please check your email for confirmation.' 
      });
      
      // Clear the form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        university: '',
        phone: '',
      });
      
      // Switch to login tab after showing success message
      setTimeout(() => {
        setActiveTab('login');
        setFeedback({ type: 'info', message: 'Please confirm your email, then log in.' });
      }, 3000);

    } catch (error) {
      console.error('Signup error:', error);
      setFeedback({ type: 'error', message: 'Signup failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Enhanced Feedback component with better mobile behavior
  const FeedbackMessage = ({ type, message, onClose }) => {
    if (!message) return null;

    const bgColor = {
      success: 'bg-green-50 border-green-200',
      error: 'bg-red-50 border-red-200',
      info: 'bg-blue-50 border-blue-200'
    };

    const textColor = {
      success: 'text-green-800',
      error: 'text-red-800',
      info: 'text-blue-800'
    };

    const Icon = {
      success: CheckCircle,
      error: AlertCircle,
      info: AlertCircle
    };

    const IconComponent = Icon[type];

    return (
      <div className={`p-3 sm:p-4 rounded-lg border flex items-start gap-3 ${bgColor[type]} animate-in slide-in-from-top-2 duration-300`}>
        <IconComponent className={`h-5 w-5 mt-0.5 flex-shrink-0 ${textColor[type]}`} />
        <p className={`text-sm sm:text-base flex-1 ${textColor[type]} leading-relaxed`}>{message}</p>
        {onClose && type !== 'info' && (
          <button 
            onClick={onClose}
            className={`${textColor[type]} hover:opacity-70 p-1 -m-1 touch-manipulation`}
            aria-label="Close message"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50 touch-manipulation">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="py-4 sm:py-8 lg:py-12">
          <div className="max-w-md sm:max-w-xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
              {/* Header - More compact on mobile */}
              <div className="p-4 sm:p-6 space-y-2 text-center border-b border-gray-100">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="bg-blue-500/10 p-2 sm:p-3 rounded-full">
                    <Home className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">Welcome to UniStay</h2>
                <p className="text-sm sm:text-base text-blue-600">Your gateway to student accommodation</p>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                {/* User Type Selection - Stack on very small screens */}
                <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 justify-center mb-4 sm:mb-6">
                  <button
                    onClick={() => {
                      setUserType('student');
                      clearFeedback();
                    }}
                    className={`flex items-center justify-center gap-2 px-4 py-3 sm:py-2 rounded-lg sm:rounded-md transition-all duration-200 text-sm sm:text-base touch-manipulation ${
                      userType === 'student'
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                        : 'border border-gray-300 hover:bg-blue-50 active:bg-blue-100'
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    Student
                  </button>
                  <button
                    onClick={() => {
                      setUserType('landlord');
                      clearFeedback();
                    }}
                    className={`flex items-center justify-center gap-2 px-4 py-3 sm:py-2 rounded-lg sm:rounded-md transition-all duration-200 text-sm sm:text-base touch-manipulation ${
                      userType === 'landlord'
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                        : 'border border-gray-300 hover:bg-blue-50 active:bg-blue-100'
                    }`}
                  >
                    <Building className="h-4 w-4" />
                    Landlord
                  </button>
                </div>

                {/* Tabs - Enhanced mobile styling */}
                <div className="w-full">
                  <div className="flex rounded-xl bg-blue-50 p-1">
                    <button
                      onClick={() => {
                        setActiveTab('login');
                        clearFeedback();
                      }}
                      className={`flex-1 text-sm sm:text-base font-medium py-3 sm:py-2 rounded-lg transition-all duration-200 touch-manipulation ${
                        activeTab === 'login' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-600 hover:bg-blue-100'
                      }`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('signup');
                        clearFeedback();
                      }}
                      className={`flex-1 text-sm sm:text-base font-medium py-3 sm:py-2 rounded-lg transition-all duration-200 touch-manipulation ${
                        activeTab === 'signup' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-600 hover:bg-blue-100'
                      }`}
                    >
                      Sign up
                    </button>
                  </div>

                  {/* Feedback Message */}
                  {feedback.message && (
                    <div className="mt-4">
                      <FeedbackMessage 
                        type={feedback.type} 
                        message={feedback.message}
                        onClose={() => setFeedback({ type: '', message: '' })}
                      />
                    </div>
                  )}

                  {/* Login Form */}
                  {activeTab === 'login' && (
                    <div className="space-y-4 sm:space-y-5 mt-4 sm:mt-6">
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-blue-900">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                          <input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 sm:py-2 border rounded-lg sm:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base sm:text-sm transition-colors ${
                              errors.email ? 'border-red-300' : 'border-blue-200'
                            }`}
                            autoComplete="email"
                            inputMode="email"
                          />
                          {errors.email && (
                            <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-blue-900">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-12 py-3 sm:py-2 border rounded-lg sm:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base sm:text-sm transition-colors ${
                              errors.password ? 'border-red-300' : 'border-blue-200'
                            }`}
                            autoComplete="current-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600 p-1 touch-manipulation"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          {errors.password && (
                            <p className="text-red-600 text-xs mt-1">{errors.password}</p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleLoginSubmit}
                        disabled={loading}
                        className="w-full py-3 sm:py-2 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg sm:rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-sm font-medium touch-manipulation shadow-sm"
                      >
                        {loading ? "Signing in..." : "Sign in"}
                      </button>
                    </div>
                  )}

                  {/* Signup Form */}
                  {activeTab === 'signup' && (
                    <div className="space-y-4 sm:space-y-5 mt-4 sm:mt-6">
                      <div className="space-y-2">
                        <label htmlFor="fullName" className="block text-sm font-medium text-blue-900">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                          <input
                            id="fullName"
                            type="text"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 sm:py-2 border rounded-lg sm:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base sm:text-sm transition-colors ${
                              errors.fullName ? 'border-red-300' : 'border-blue-200'
                            }`}
                            autoComplete="name"
                          />
                          {errors.fullName && (
                            <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-blue-900">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                          <input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-3 sm:py-2 border rounded-lg sm:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base sm:text-sm transition-colors ${
                              errors.email ? 'border-red-300' : 'border-blue-200'
                            }`}
                            autoComplete="email"
                            inputMode="email"
                          />
                          {errors.email && (
                            <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      {userType === 'student' && (
                        <>
                          <div className="space-y-2">
                            <label htmlFor="university" className="block text-sm font-medium text-blue-900">
                              University/College
                            </label>
                            <div className="relative">
                              <BookOpen className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                              <input
                                id="university"
                                type="text"
                                placeholder="Your University"
                                value={formData.university}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-3 sm:py-2 border rounded-lg sm:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base sm:text-sm transition-colors ${
                                  errors.university ? 'border-red-300' : 'border-blue-200'
                                }`}
                                autoComplete="organization"
                              />
                              {errors.university && (
                                <p className="text-red-600 text-xs mt-1">{errors.university}</p>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="phone" className="block text-sm font-medium text-blue-900">
                              Phone Number
                            </label>
                            <div className="relative">
                              <Phone className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                              <input
                                id="phone"
                                type="tel"
                                placeholder="+44 123 456 7890"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-3 sm:py-2 border rounded-lg sm:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base sm:text-sm transition-colors ${
                                  errors.phone ? 'border-red-300' : 'border-blue-200'
                                }`}
                                autoComplete="tel"
                                inputMode="tel"
                              />
                              {errors.phone && (
                                <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      {userType === 'landlord' && (
                        <div className="space-y-2">
                          <label htmlFor="phone" className="block text-sm font-medium text-blue-900">
                            Phone Number (WhatsApp)
                          </label>
                          <div className="relative">
                            <Phone className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                            <input
                              id="phone"
                              type="tel"
                              placeholder="+44 123 456 7890"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-3 sm:py-2 border rounded-lg sm:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base sm:text-sm transition-colors ${
                                errors.phone ? 'border-red-300' : 'border-blue-200'
                              }`}
                              autoComplete="tel"
                              inputMode="tel"
                            />
                            {errors.phone && (
                              <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-blue-900">
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-12 py-3 sm:py-2 border rounded-lg sm:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base sm:text-sm transition-colors ${
                              errors.password ? 'border-red-300' : 'border-blue-200'
                            }`}
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-600 p-1 touch-manipulation"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          {errors.password && (
                            <p className="text-red-600 text-xs mt-1">{errors.password}</p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleSignupSubmit}
                        disabled={loading}
                        className="w-full py-3 sm:py-2 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg sm:rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-sm font-medium touch-manipulation shadow-sm"
                      >
                        {loading ? "Creating account..." : "Create account"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-6 border-t border-gray-100 text-center text-xs sm:text-sm text-blue-600">
                {userType === 'student'
                  ? "Find your perfect student home"
                  : "List your properties to thousands of students"
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniStayAuth;