import React, { useState, useEffect } from 'react';
import { Mail, Phone, MessageCircle, Check, X } from 'lucide-react';
import ContactInfo from '../components/ContactInfo';

const ContactUs = () => {
  const initialFormState = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [validFields, setValidFields] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Validation patterns
  const patterns = {
    name: /^[a-zA-Z\s]{2,30}$/,
    email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    phone: /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
    message: /.{10,}/
  };

  // Validation messages
  const validationMessages = {
    name: {
      pattern: 'Name should only contain letters and spaces (2-30 characters)',
      required: 'Name is required'
    },
    email: {
      pattern: 'Please enter a valid email address',
      required: 'Email is required'
    },
    phone: {
      pattern: 'Please enter a valid phone number'
    },
    message: {
      pattern: 'Message should be at least 10 characters long',
      required: 'Message is required'
    }
  };

  // Live validation function
  const validateField = (name, value) => {
    if (!value.trim() && (name === 'name' || name === 'email' || name === 'message')) {
      return validationMessages[name].required;
    }
    
    if (patterns[name] && value.trim() && !patterns[name].test(value.trim())) {
      return validationMessages[name].pattern;
    }

    return '';
  };

  // Handle real-time validation
  useEffect(() => {
    const newValidFields = {};
    const newErrors = {};

    Object.keys(formData).forEach(field => {
      if (formData[field].trim()) {
        const error = validateField(field, formData[field]);
        if (!error) {
          newValidFields[field] = true;
        } else {
          newErrors[field] = error;
        }
      }
    });

    setValidFields(newValidFields);
    setErrors(newErrors);
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    // Validate all required fields
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
      setFormData(initialFormState);
      setValidFields({});
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } else {
      setErrors(newErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getInputClassName = (fieldName) => {
    const baseClasses = "mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1";
    if (errors[fieldName]) {
      return `${baseClasses} border-red-500 focus:border-red-500 focus:ring-red-500`;
    }
    if (validFields[fieldName]) {
      return `${baseClasses} border-green-500 focus:border-green-500 focus:ring-green-500`;
    }
    return `${baseClasses} border-gray-300 focus:border-blue-500 focus:ring-blue-500`;
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about student housing? We're here to help! Fill out the form below
            and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <ContactInfo/>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center">
                <Check className="w-5 h-5 mr-2" />
                Thank you for your message! We will get back to you soon.
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {['name', 'email', 'phone', 'subject', 'message'].map((field) => (
                <div key={field} className="relative">
                  <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                    {field} {field !== 'phone' && field !== 'subject' && '*'}
                  </label>
                  {field === 'message' ? (
                    <textarea
                      id={field}
                      name={field}
                      rows={4}
                      value={formData[field]}
                      onChange={handleChange}
                      className={getInputClassName(field)}
                    />
                  ) : (
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className={getInputClassName(field)}
                    />
                  )}
                  {validFields[field] && (
                    <Check className="absolute right-3 top-8 w-5 h-5 text-green-500" />
                  )}
                  {errors[field] && (
                    <div className="mt-1 flex items-center text-sm text-red-500">
                      <X className="w-4 h-4 mr-1" />
                      {errors[field]}
                    </div>
                  )}
                </div>
              ))}

              <button
                type="submit"
                className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;