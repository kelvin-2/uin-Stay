import React from 'react';
import { Mail, Lock } from 'lucide-react';

const LoginForm = ({ 
  formData, 
  errors, 
  loading, 
  onInputChange, 
  onSubmit, 
  onForgotPassword 
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
            onChange={onInputChange}
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
            onChange={onInputChange}
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
      
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
        >
          Forgot your password?
        </button>
      </div>
    </form>
  );
};

export default LoginForm;