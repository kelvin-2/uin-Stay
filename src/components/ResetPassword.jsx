import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import supabase from '../supabaseClient';
import { Lock, CheckCircle, AlertCircle, Home, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validSession, setValidSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have valid session from the reset link
    const checkSession = async () => {
      try {
        // First, check if we have the required tokens in URL
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type');

        if (type === 'recovery' && accessToken && refreshToken) {
          // Set the session using the tokens from URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            setMessage({ 
              type: 'error', 
              text: 'Invalid or expired reset link. Please request a new password reset.' 
            });
            setValidSession(false);
            return;
          }

          if (data.session) {
            setValidSession(true);
          }
        } else {
          // Fallback: check if we already have a valid session
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            setMessage({ 
              type: 'error', 
              text: 'Invalid or expired reset link. Please request a new password reset.' 
            });
            setValidSession(false);
          } else {
            setValidSession(true);
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        setMessage({ 
          type: 'error', 
          text: 'Something went wrong. Please try requesting a password reset again.' 
        });
        setValidSession(false);
      }
    };
    
    checkSession();
  }, [searchParams]);

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    // Enhanced password validation
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setMessage({ type: 'error', text: passwordErrors[0] });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        if (error.message.includes('session_not_found')) {
          throw new Error('Your session has expired. Please request a new password reset link.');
        }
        throw error;
      }

      setMessage({ 
        type: 'success', 
        text: 'Password updated successfully! Redirecting to login...' 
      });

      // Clear the form
      setPassword('');
      setConfirmPassword('');

      // Sign out the user to ensure they log in with new password
      await supabase.auth.signOut();

      setTimeout(() => {
        navigate('/auth', { 
          state: { message: 'Password reset successful. Please log in with your new password.' }
        });
      }, 2000);

    } catch (error) {
      console.error('Password reset error:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to update password. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestNewLink = () => {
    navigate('/auth', { 
      state: { showForgotPassword: true }
    });
  };

  // Loading state while checking session
  if (validSession === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid session state
  if (validSession === false) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden">
                <div className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-red-500/10 p-3 rounded-full">
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-red-900 mb-2">Invalid Reset Link</h2>
                  {message.text && (
                    <p className="text-red-600 mb-4">{message.text}</p>
                  )}
                  <div className="space-y-2">
                    <button
                      onClick={handleRequestNewLink}
                      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                    >
                      Request New Reset Link
                    </button>
                    <button
                      onClick={() => navigate('/auth')}
                      className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Back to Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
              {/* Header */}
              <div className="p-6 space-y-2 text-center border-b border-gray-100">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-500/10 p-3 rounded-full">
                    <Home className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-blue-900">Reset Your Password</h2>
                <p className="text-blue-600">Enter your new secure password below</p>
              </div>

              <div className="p-6">
                {message.text && (
                  <div className={`p-3 rounded-lg mb-4 flex items-center gap-2 ${
                    message.type === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {message.type === 'success' ? 
                      <CheckCircle className="h-5 w-5" /> : 
                      <AlertCircle className="h-5 w-5" />
                    }
                    <span className="text-sm">{message.text}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-blue-900">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full pl-10 pr-12 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-blue-400 hover:text-blue-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Password must be at least 6 characters with uppercase, lowercase, and number
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-900">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full pl-10 pr-12 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-blue-400 hover:text-blue-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Updating Password...' : 'Update Password'}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate('/auth')}
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;