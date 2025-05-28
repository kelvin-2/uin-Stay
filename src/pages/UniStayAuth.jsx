import React, { useState } from 'react';
import { Building, User, Mail, Lock, Home, BookOpen, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AutContext';
import supabase from '../supabaseClient';

const UniStayAuth = () => {
  const [userType, setUserType] = useState('student');
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    university: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [signupMessage, setSignupMessage] = useState('');
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();

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
      if (!formData.fullName?.trim()) {
        newErrors.fullName = 'Full name is required';
      }

      if (userType === 'student') {
        if (!formData.university?.trim()) {
          newErrors.university = 'University is required';
        }
        
        if (!formData.phone?.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[0-9\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
          newErrors.phone = 'Invalid phone number format';
        }
      }

      if (userType === 'landlord') {
        if (!formData.phone?.trim()) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[0-9\s\-\(\)]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
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
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      
      if (error) throw error;
      
      const userId = data.user?.id;
      if (!userId) {
        throw new Error("Unable to retrieve user information after login.");
      }
      
      console.log("Auth ID retrieved:", userId);
      
      // Wait for session to be established
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", userId)
        .maybeSingle();
      
      if (userError) {
        console.error("Database query error:", userError);
        throw new Error("Database error: " + userError.message);
      }
      
      if (!userData) {
        // Fallback to email lookup
        const userEmail = data.user?.email;
        const { data: emailLookup, error: emailError } = await supabase
          .from("users")
          .select("*")
          .eq("email", userEmail)
          .maybeSingle();
          
        if (emailLookup) {
          console.log("Found user by email, updating auth_id");
          const { error: updateError } = await supabase
            .from("users")
            .update({ auth_id: userId })
            .eq("email", userEmail);
            
          if (!updateError) {
            userData = { ...emailLookup, auth_id: userId };
          }
        } else {
          throw new Error("User profile not found. Please sign up first.");
        }
      }
      
      if (!userData?.role) {
        throw new Error("User role not defined. Please contact support.");
      }
      
      const userRole = userData.role;
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("userName", userData.full_name || '');
      
      login(userRole);
      
      if (userRole === "landlord") {
        navigate("/landlord-dashboard");
      } else if (userRole === "student") {
        navigate("/");
      } else {
        navigate("/");
      }
      
      console.log("Login successful:", userRole);
      
    } catch (error) {
      console.error("Login error:", error.message);
      setErrors({ auth: error.message || "Login failed. Please try again." });
      
      // Clean up on error
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        await supabase.auth.signOut();
      }
    } finally {
      setLoading(false);
    }
  };

// Replace your handleSignupSubmit function with this enhanced version
const handleSignupSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  setLoading(true);
  setErrors({});
  setSignupMessage('');

  try {
    const emailLower = formData.email.trim().toLowerCase();
    
    console.log('Starting signup process for:', { userType, email: emailLower });
    
    // 1. Check if user already exists in public.users table
    const { data: existingPublicUser, error: publicLookupError } = await supabase
      .from('users')
      .select('auth_id, email')
      .eq('email', emailLower)
      .maybeSingle();

    if (publicLookupError && publicLookupError.code !== 'PGRST116') {
      console.error('Database lookup error:', publicLookupError);
      throw new Error('Database connection error. Please try again.');
    }

    if (existingPublicUser) {
      throw new Error('This email is already registered. Please log in instead.');
    }

    // 2. Attempt to create auth user with minimal metadata
    console.log('Creating auth user...');
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: emailLower,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName.trim(),
          user_type: userType
        }
      }
    });

    if (signupError) {
      console.error('Auth signup error:', {
        message: signupError.message,
        status: signupError.status,
        userType: userType
      });
      
      if (signupError.message.includes('already registered') || 
          signupError.message.includes('already exists')) {
        throw new Error('This email is already registered. Please log in instead.');
      }
      
      throw new Error(signupError.message || 'Authentication signup failed. Please try again.');
    }

    const userId = signupData.user?.id;
    if (!userId) {
      throw new Error('User creation failed - no user ID returned');
    }

    console.log('Auth user created successfully:', userId);

    // 3. Create user profile with detailed logging
    const userProfile = {
      auth_id: userId,
      full_name: formData.fullName.trim(),
      email: emailLower,
      role: userType, // This should be either 'student' or 'landlord'
      university: userType === 'student' ? (formData.university?.trim() || null) : null,
      phone_number: formData.phone?.trim() || null,
      created_at: new Date().toISOString()
    };

    console.log('Attempting to insert user profile:', {
      ...userProfile,
      auth_id: '[UUID]' // Don't log the actual UUID
    });

    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert([userProfile])
      .select(); // Add select to get the inserted data back

    if (insertError) {
      console.error('Profile creation error details:', {
        message: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint,
        userType: userType,
        profileData: {
          ...userProfile,
          auth_id: '[UUID]'
        }
      });
      
      // Clean up auth user if profile creation fails
      try {
        await supabase.auth.signOut();
        console.log('Cleaned up auth user after profile creation failure');
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
      
      if (insertError.code === '23505') { // Unique constraint violation
        throw new Error('This email is already registered. Please log in instead.');
      }
      
      if (insertError.code === '42501') { // Insufficient privilege
        throw new Error('Permission denied. Please check your account permissions.');
      }
      
      if (insertError.code === '23502') { // NOT NULL violation
        throw new Error(`Required field missing: ${insertError.details || 'Unknown field'}`);
      }
      
      if (insertError.code === '23514') { // Check constraint violation
        throw new Error(`Invalid data format: ${insertError.details || 'Please check your information'}`);
      }
      
      throw new Error(`Profile creation failed: ${insertError.message}`);
    }

    console.log('User profile created successfully:', insertData);

    // 4. Handle email confirmation requirement
    if (signupData.user && !signupData.session) {
      setSignupMessage('Please check your email for a confirmation link to complete your registration.');
      return;
    }

    // 5. Auto-login if no confirmation needed
    localStorage.setItem("userRole", userType);
    localStorage.setItem("userName", formData.fullName.trim());
    login(userType);
    
    const redirectPath = userType === 'landlord' ? '/landlord-dashboard' : '/';
    navigate(redirectPath);

  } catch (error) {
    console.error('Complete signup error details:', {
      message: error.message,
      stack: error.stack,
      userType: userType,
      timestamp: new Date().toISOString()
    });
    
    let errorMessage = 'Signup failed. Please try again.';
    
    if (error.message.includes('Permission denied')) {
      errorMessage = 'Account creation is temporarily disabled. Please contact support.';
    } else if (error.message.includes('already registered') || 
        error.message.includes('already exists')) {
      errorMessage = 'This email is already registered. Please log in instead.';
    } else if (error.message.includes('Invalid email')) {
      errorMessage = 'Please enter a valid email address.';
    } else if (error.message.includes('Password')) {
      errorMessage = 'Password must be at least 6 characters long.';
    } else if (error.message.includes('rate limit')) {
      errorMessage = 'Too many attempts. Please wait a few minutes and try again.';
    } else if (error.message.includes('Database connection')) {
      errorMessage = 'Database connection error. Please check your internet and try again.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    setErrors({ auth: errorMessage });
  } finally {
    setLoading(false);
  }
};

  // Reset form when switching between login/signup or user types
  React.useEffect(() => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      university: '',
      phone: '',
    });
    setErrors({});
    setSignupMessage('');
  }, [activeTab, userType]);
  
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

                  {/* Error Display */}
                  {errors.auth && (
                    <div className="mt-4 p-3 text-sm bg-red-50 text-red-700 rounded-md">
                      {errors.auth}
                    </div>
                  )}

                  {/* Success Message */}
                  {signupMessage && (
                    <div className="mt-4 p-3 text-sm bg-green-50 text-green-700 rounded-md">
                      {signupMessage}
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
                        </div>
                        {errors.email && (
                          <p className="text-sm text-red-600">{errors.email}</p>
                        )}
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
                        </div>
                        {errors.password && (
                          <p className="text-sm text-red-600">{errors.password}</p>
                        )}
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
                        <label htmlFor="fullName" className="block text-sm font-medium text-blue-900">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                          <input
                            id="fullName"
                            type="text"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
                              errors.fullName ? 'border-red-300' : 'border-blue-200'
                            }`}
                          />
                        </div>
                        {errors.fullName && (
                          <p className="text-sm text-red-600">{errors.fullName}</p>
                        )}
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
                        </div>
                        {errors.email && (
                          <p className="text-sm text-red-600">{errors.email}</p>
                        )}
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
                            </div>
                            {errors.university && (
                              <p className="text-sm text-red-600">{errors.university}</p>
                            )}
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
                            </div>
                            {errors.phone && (
                              <p className="text-sm text-red-600">{errors.phone}</p>
                            )}
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
                          </div>
                          {errors.phone && (
                            <p className="text-sm text-red-600">{errors.phone}</p>
                          )}
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
                            placeholder="Enter your password (min 6 characters)"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
                              errors.password ? 'border-red-300' : 'border-blue-200'
                            }`}
                          />
                        </div>
                        {errors.password && (
                          <p className="text-sm text-red-600">{errors.password}</p>
                        )}
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