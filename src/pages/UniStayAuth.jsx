import React, { useState } from 'react';
import { Building, User, Mail, Lock, Home, BookOpen, Phone, MapPin, CheckCircle, AlertCircle, X } from 'lucide-react';
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
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();

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
      
      // Step 1: Sign in the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before signing in.');
        } else if (error.message.includes('Too many requests')) {
          throw new Error('Too many login attempts. Please wait a moment before trying again.');
        }
        throw error;
      }
      
      // Get user ID from the authentication response
      const userId = data.user?.id;
      if (!userId) {
        throw new Error("Unable to retrieve user information after login.");
      }
      
      setFeedback({ type: 'info', message: 'Verifying your account...' });
      
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Brief pause for better UX

      // Add debugging step: Check auth session
      const { data: sessionData } = await supabase.auth.getSession();

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", userId)
        .maybeSingle();
      
      if (userError) {
        console.error("Database query error:", userError);
        throw new Error("Database error: " + userError.message);
      }
      
      // Check if user data exists
      if (!userData) {
        console.log("User not found with auth_id, trying email lookup");
        const userEmail = data.user?.email;
        
        const { data: emailLookup, error: emailError } = await supabase
          .from("users")
          .select("*")
          .eq("email", userEmail)
          .maybeSingle();
          
        if (emailLookup) {
          console.log("Found user by email instead of auth_id!");
          
          // Update the auth_id in the database to match
          const { error: updateError } = await supabase
            .from("users")
            .update({ auth_id: userId })
            .eq("email", userEmail);
            
          if (updateError) {
            console.error("Failed to update auth_id:", updateError);
          }
          
          // Use the email-found user data
          userData = emailLookup;
        } else {
          throw new Error("User profile not found. Please sign up first or contact support.");
        }
      }
      
      // Ensure role exists
      if (!userData.role) {
        throw new Error("User role not defined. Please contact support.");
      }
      
      setFeedback({ type: 'success', message: `Welcome back, ${userData.full_name || 'User'}!` });
      
      // Step 3: Store user data and login
      const userRole = userData.role;
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("userName", userData.full_name || '');
      
      // Update auth context
      login(userRole);
      
      // Brief delay to show success message
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Step 4: Redirect based on role
      if (userRole === "landlord") {
        navigate("/landlord-dashboard");
      } else if (userRole === "student") {
        navigate("/");
      } else {
        navigate("/");
      }
      
    } catch (error) {
      console.error("Login error:", error.message);
      setFeedback({ 
        type: 'error', 
        message: error.message || "Login failed. Please try again." 
      });
      
      // Optionally sign out if login was partially successful but profile fetch failed
      const { data } = await supabase.auth.getSession();
      if (data && data.session) {
        await supabase.auth.signOut();
      }
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
      
      // 1. Check public.users table with proper headers
      const { data: existingPublicUser, error: publicLookupError } = await supabase
        .from('users')
        .select('auth_id')
        .eq('email', formData.email)
        .maybeSingle();

      if (publicLookupError) throw publicLookupError;
      if (existingPublicUser) {
        throw new Error('This email is already registered. Please try logging in instead.');
      }

      setFeedback({ type: 'info', message: 'Setting up your authentication...' });

      // 2. Attempt signup
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            user_type: userType
          }
        }
      });

      // 3. Handle user already exists case
      if (signupError) {
        if (signupError.message.includes('already registered')) {
          setFeedback({ type: 'info', message: 'Account exists, trying to complete setup...' });
          
          // Try to sign in to verify
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });

          if (signInError) {
            throw new Error('An account with this email exists but the password is incorrect. Please try logging in or reset your password.');
          }

          // Check if user exists in public.users
          const { data: userInPublicTable } = await supabase
            .from('users')
            .select('auth_id')
            .eq('email', formData.email)
            .single();

          if (!userInPublicTable) {
            // Complete registration in public.users
            const { data: { user } } = await supabase.auth.getUser();
            
            await supabase.from('users').insert([{
              auth_id: user.id,
              full_name: formData.fullName,
              email: formData.email,
              role: userType,
              university: formData.university || null,
              phone_number: formData.phone || null,
              created_at: new Date().toISOString()
            }]);

            setFeedback({ type: 'success', message: 'Account setup completed successfully! Redirecting...' });
            login(userType);
            
            await new Promise((resolve) => setTimeout(resolve, 1500));
            navigate(userType === 'landlord' ? '/landlord-dashboard' : '/student-dashboard');
            return;
          }

          throw new Error('This email is already fully registered. Please log in instead.');
        }
        
        // Handle other signup errors
        if (signupError.message.includes('Password should be at least')) {
          throw new Error('Password must be at least 6 characters long.');
        } else if (signupError.message.includes('Unable to validate email')) {
          throw new Error('Please enter a valid email address.');
        } else if (signupError.message.includes('rate limit')) {
          throw new Error('Too many requests. Please wait a moment before trying again.');
        }
        
        throw signupError;
      }

      // 4. Handle new user creation
      const userId = signupData.user?.id;
      if (!userId) {
        throw new Error('User creation failed - no user ID returned');
      }

      setFeedback({ type: 'info', message: 'Finalizing your profile...' });

      // Insert into public.users
      const { error: insertError } = await supabase.from('users').insert([{
        auth_id: userId,
        full_name: formData.fullName,
        email: formData.email,
        role: userType,
        university: formData.university || null,
        phone_number: formData.phone || null,
        created_at: new Date().toISOString()
      }]);

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error('Failed to create user profile. Please try again.');
      }

      // 5. Handle email confirmation case
      if (signupData.user && !signupData.session) {
        setFeedback({ 
          type: 'success', 
          message: 'Account created successfully! Please check your email for a confirmation link before signing in.' 
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
        return;
      }

      // 6. Login and redirect if no confirmation needed
      setFeedback({ type: 'success', message: `Welcome to UniStay, ${formData.fullName}! Redirecting...` });
      login(userType);
      
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate(userType === 'landlord' ? '/landlord-dashboard' : '/student-dashboard');

    } catch (error) {
      console.error('Signup error:', error);
      
      // User-friendly error messages
      let errorMessage = 'Signup failed. Please try again.';
      
      if (error.message.includes('already registered') || 
          error.message.includes('already exists')) {
        errorMessage = 'This email is already registered. Please log in instead.';
      } else if (error.message.includes('password is incorrect')) {
        errorMessage = 'An account exists with this email but the password is incorrect. Try logging in or reset your password.';
      } else if (error.message.includes('406')) {
        errorMessage = 'Invalid request format. Please contact support.';
      } else if (error.message.includes('email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.message.includes('Password')) {
        errorMessage = 'Password must be at least 6 characters long.';
      } else if (error.message) {
        errorMessage = error.message;
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