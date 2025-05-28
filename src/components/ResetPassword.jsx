import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Home, CheckCircle, AlertCircle } from 'lucide-react';
import supabase from '../supabaseClient';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user came from password reset email
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');

    if (type !== 'recovery' || !accessToken) {
      setFeedback({ 
        type: 'error', 
        message: 'Invalid reset link. Please request a new password reset.' 
      });
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setFeedback({ type: '', message: '' });

    try {
      setFeedback({ type: 'info', message: 'Updating your password...' });

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        if (error.message.includes('session_not_found')) {
          throw new Error('Reset link has expired. Please request a new password reset.');
        } else if (error.message.includes('same_password')) {
          throw new Error('New password must be different from your current password.');
        }
        throw error;
      }

      setFeedback({ 
        type: 'success', 
        message: 'Password updated successfully! Redirecting to login...' 
      });

      // Clear form
      setPassword('');
      setConfirmPassword('');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/auth');
      }, 2000);

    } catch (error) {
      console.error('Password reset error:', error);
      setFeedback({ 
        type: 'error', 
        message: error.message || 'Failed to update password. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const FeedbackMessage = ({ type, message }) => {
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
      </div>
    );
  };

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
                <h2 className="text-2xl font-bold text-blue-900">Reset Password</h2>
                <p className="text-blue-600">Enter your new password below</p>
              </div>

              <div className="p-6">
                {/* Feedback Message */}
                {feedback.message && (
                  <div className="mb-4">
                    <FeedbackMessage type={feedback.type} message={feedback.message} />
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
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
                          errors.password ? 'border-red-300' : 'border-blue-200'
                        }`}
                      />
                      {errors.password && (
                        <p className="text-red-600 text-xs mt-1">{errors.password}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-900">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                      <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
                          errors.confirmPassword ? 'border-red-300' : 'border-blue-200'
                        }`}
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Updating..." : "Update Password"}
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