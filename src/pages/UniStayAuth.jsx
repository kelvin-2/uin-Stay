import React, { useState } from 'react';
import { Building, User, Mail, Lock, Home, BookOpen, Phone, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AutContext';
import { createUser, loginUser } from '../api/auth';

const UniStayAuth = () => {
  const [userType, setUserType] = useState('student');
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    university: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

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
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }

      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
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
      
      // Call backend login API
      const response = await loginUser(formData.email, formData.password);
      
      const userData = response.user;
      const userRole = userData.role;
      
      // Store in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("userName", userData.full_name || '');
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("currentUser", JSON.stringify(userData));
      
      console.log('✅ Login successful, stored data:', {
        token: !!response.token,
        userRole,
        userName: userData.full_name
      });
      
      // Update auth context with userData object
      login(userData);
      
      setFeedback({ type: 'success', message: `Welcome back, ${userData.full_name || 'User'}!` });
      
      // Small delay to show success message and ensure state updates
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Redirect based on role
      const redirectPath = userRole === "landlord" ? "/landlord-dashboard" : "/";
      console.log('🚀 Navigating to:', redirectPath);
      navigate(redirectPath, { replace: true });
      
    } catch (error) {
      console.error("❌ Login error:", error.message);
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
    
    // Call backend createUser API with role
    const signupResponse = await createUser({
      email: formData.email,
      user_name: formData.email.split('@')[0],
      first_name: formData.firstName,
      last_name: formData.lastName,
      password: formData.password,
      role: userType,
      phone_number: formData.phone || null,
      university: formData.university || null
    });

    console.log('✅ Signup response:', signupResponse);
    
    // Check if signup was successful
    if (signupResponse.user) {
      setFeedback({ type: 'info', message: 'Account created! Logging you in...' });
      
      // Wait a bit for the database to fully commit the new user
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      try {
        // Attempt to login with the credentials
        const loginResponse = await loginUser(formData.email, formData.password);
        
        console.log('✅ Auto-login response:', loginResponse);
        
        const userData = loginResponse.user;
        const userRole = userData.role;
        
        // Store all auth data in localStorage
        localStorage.setItem("token", loginResponse.token);
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("userName", userData.full_name || `${userData.first_name} ${userData.last_name}`);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("currentUser", JSON.stringify(userData));
        
        console.log('💾 Auth data stored:', {
          token: !!loginResponse.token,
          userRole: userRole,
          userName: localStorage.getItem("userName")
        });
        
        // Update auth context with userData object
        login(userData);
        
        console.log('🎯 Auth context updated');
        
        setFeedback({ 
          type: 'success', 
          message: `Welcome to UniStay, ${formData.firstName}!` 
        });
        
        // Wait for state to update
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Navigate based on role
        const redirectPath = userRole === 'landlord' ? '/landlord-dashboard' : '/';
        console.log('🚀 Navigating to:', redirectPath);
        
        navigate(redirectPath, { replace: true });
        
      } catch (loginError) {
        // If auto-login fails, that's okay - just show a message to log in manually
        console.warn('⚠️ Auto-login failed:', loginError.message);
        
        // Clear form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          university: '',
          phone: '',
        });
        
        // Switch to login tab
        setActiveTab('login');
        setFeedback({ 
          type: 'success', 
          message: 'Account created successfully! Please log in with your credentials.' 
        });
      }
    } else {
      throw new Error('Signup failed. Please try again.');
    }

  } catch (error) {
    console.error('❌ Signup error:', error);
    
    let errorMessage = error.message || 'Signup failed. Please try again.';
    
    if (errorMessage.includes('already exists') || errorMessage.includes('already registered')) {
      errorMessage = 'This email is already registered. Please log in instead.';
      // Switch to login tab for better UX
      setActiveTab('login');
    } else if (errorMessage.includes('Invalid user data')) {
      errorMessage = 'Please check all fields and try again.';
    } else if (errorMessage.includes('password')) {
      errorMessage = 'Password must be at least 6 characters long.';
    }
    
    setFeedback({ type: 'error', message: errorMessage });
  } finally {
    setLoading(false);
  }
};

  // Feedback component
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
      <div className={`p-3 rounded-lg border flex items-start gap-3 ${bgColor[type]}`}>
        <IconComponent className={`h-5 w-5 mt-0.5 flex-shrink-0 ${textColor[type]}`} />
        <p className={`text-sm flex-1 ${textColor[type]}`}>{message}</p>
        {onClose && type !== 'info' && (
          <button 
            onClick={onClose}
            className={`${textColor[type]} hover:opacity-70`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
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
                    onClick={() => {
                      setUserType('student');
                      clearFeedback();
                    }}
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
                    onClick={() => {
                      setUserType('landlord');
                      clearFeedback();
                    }}
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
                      onClick={() => {
                        setActiveTab('login');
                        clearFeedback();
                      }}
                      className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
                        activeTab === 'login' ? 'bg-blue-600 text-white' : 'text-blue-600'
                      }`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('signup');
                        clearFeedback();
                      }}
                      className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
                        activeTab === 'signup' ? 'bg-blue-600 text-white' : 'text-blue-600'
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
                    <form onSubmit={handleLoginSubmit} className="space-y-4 mt-4">
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
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
                              errors.email ? 'border-red-300' : 'border-blue-200'
                            }`}
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
                          <Lock className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                          <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
                              errors.password ? 'border-red-300' : 'border-blue-200'
                            }`}
                          />
                          {errors.password && (
                            <p className="text-red-600 text-xs mt-1">{errors.password}</p>
                          )}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Signing in..." : "Sign in"}
                      </button>
                    </form>
                  )}

                  {/* Signup Form */}
                  {activeTab === 'signup' && (
                    <form onSubmit={handleSignupSubmit} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="block text-sm font-medium text-blue-900">
                          First Name
                        </label>
                        <div className="relative">
                          <User className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                          <input
                            id="firstName"
                            type="text"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
                              errors.firstName ? 'border-red-300' : 'border-blue-200'
                            }`}
                          />
                          {errors.firstName && (
                            <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="lastName" className="block text-sm font-medium text-blue-900">
                          Last Name
                        </label>
                        <div className="relative">
                          <User className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                          <input
                            id="lastName"
                            type="text"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
                              errors.lastName ? 'border-red-300' : 'border-blue-200'
                            }`}
                          />
                          {errors.lastName && (
                            <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>
                          )}
                        </div>
                      </div>

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
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
                              errors.email ? 'border-red-300' : 'border-blue-200'
                            }`}
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
                              <BookOpen className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                              <input
                                id="university"
                                type="text"
                                placeholder="Your University"
                                value={formData.university}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
                                  errors.university ? 'border-red-300' : 'border-blue-200'
                                }`}
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
                              <Phone className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                              <input
                                id="phone"
                                type="tel"
                                placeholder="+44 123 456 7890"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
                                  errors.phone ? 'border-red-300' : 'border-blue-200'
                                }`}
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
                            <Phone className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                            <input
                              id="phone"
                              type="tel"
                              placeholder="+44 123 456 7890"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
                                errors.phone ? 'border-red-300' : 'border-blue-200'
                              }`}
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
                          <Lock className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                          <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
                              errors.password ? 'border-red-300' : 'border-blue-200'
                            }`}
                          />
                          {errors.password && (
                            <p className="text-red-600 text-xs mt-1">{errors.password}</p>
                          )}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>
      </div>
    </div>
  );
};

export default UniStayAuth;