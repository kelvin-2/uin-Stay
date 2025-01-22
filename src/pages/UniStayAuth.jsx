import React, { useState, useEffect } from 'react';
import { Building, User, Mail, Lock, Home, BookOpen, Phone, MapPin } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';

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
    location: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      navigate(userData.userType === 'student' ? '/' : '/landlord-dashboard');
    }
  }, [navigate]);

  // Rest of your validation logic remains the same
  const validateField = (id, value) => {
    const newErrors = { ...errors };

    switch (id) {
      case 'email':
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Invalid email format';
        } else {
          delete newErrors.email;
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        } else {
          delete newErrors.password;
        }
        break;

      case 'phone':
        if (value && !/^\+?[0-9]{10,}$/.test(value)) {
          newErrors.phone = 'Invalid phone number';
        } else {
          delete newErrors.phone;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    validateField(id, value);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/users');
      const users = await response.json();
      const user = users.find(
        (u) => u.email === formData.email && u.password === formData.password && u.userType === userType
      );

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        navigate(user.userType === 'student' ? '/' : '/landlord-dashboard');
      } else {
        alert('Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (Object.keys(errors).length > 0) {
      alert('Please fix the errors before submitting.');
      setLoading(false);
      return;
    }

    try {
      const checkResponse = await fetch(`http://localhost:3001/users?email=${formData.email}`);
      const existingUsers = await checkResponse.json();

      if (existingUsers.length > 0) {
        alert('Email already exists. Please use a different email.');
        return;
      }

      const userData = {
        ...formData,
        userType,
      };

      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert('Account created successfully!');
        setFormData({
          fullName: '',
          email: '',
          password: '',
          university: '',
          phone: '',
          location: '',
        });
        setActiveTab('login');
      } else {
        alert('Failed to create account. Please try again.');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                  </div>
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
                      className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
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
                        value={formData.university}
                        onChange={handleInputChange}
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
                          value={formData.phone}
                          onChange={handleInputChange}
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
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        />
                      </div>
                    </div>
                  </>
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
                      className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    />
                  </div>
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
        </div>
      </div>
    </div>
  );
};
export default UniStayAuth;