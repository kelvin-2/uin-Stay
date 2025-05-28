import React, { useState, useEffect } from 'react';
import { Mail, Phone, MessageCircle, Check, X } from 'lucide-react';
import ContactInfo from '../components/ContactInfo';
import supabase from '../supabaseClient';

const ContactUs = () => {
  const initialFormState = {
    name: '',
    email_address: '', // Changed to match your DB schema
    phoneNumber: '',   // Changed to match your DB schema
    subject: '',
    message: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [validFields, setValidFields] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation patterns
  const patterns = {
    name: /^[a-zA-Z\s]{2,30}$/,
    email_address: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    phoneNumber: /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
    message: /.{10,}/
  };

  // Validation messages
  const validationMessages = {
    name: {
      pattern: 'Name should only contain letters and spaces (2-30 characters)',
      required: 'Name is required'
    },
    email_address: {
      pattern: 'Please enter a valid email address',
      required: 'Email is required'
    },
    phoneNumber: {
      pattern: 'Please enter a valid phone number'
    },
    message: {
      pattern: 'Message should be at least 10 characters long',
      required: 'Message is required'
    }
  };

  // Live validation function
  const validateField = (name, value) => {
    if (!value.trim() && (name === 'name' || name === 'email_address' || name === 'message')) {
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

  const handleSubmit = async (e) => {
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
      setIsLoading(true);
      try {
        // Prepare data for Supabase (only include non-empty fields)
        const submitData = {
          name: formData.name.trim(),
          email_address: formData.email_address.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim()
        };

        // Only include phone number if it's provided
        if (formData.phoneNumber.trim()) {
          submitData.phoneNumber = formData.phoneNumber.trim();
        }

        // Insert data into Supabase
        const { data, error } = await supabase
          .from('Contact')
          .insert([submitData])
          .select();

        if (error) {
          throw error;
        }

        console.log('Form submitted successfully:', data);
        setFormData(initialFormState);
        setValidFields({});
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);

      } catch (error) {
        console.error('Error submitting form:', error);
        let errorMessage = 'Failed to submit the form. Please try again.';
        
        // Handle specific Supabase errors
        if (error.message) {
          if (error.message.includes('duplicate')) {
            errorMessage = 'This email has already been used for a recent submission.';
          } else if (error.message.includes('violates')) {
            errorMessage = 'Please check your input and try again.';
          }
        }
        
        setErrors({ form: errorMessage });
      } finally {
        setIsLoading(false);
      }
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

  // Form field configuration
  const formFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email_address', label: 'Email', type: 'email', required: true },
    { name: 'phoneNumber', label: 'Phone', type: 'text', required: false },
    { name: 'subject', label: 'Subject', type: 'text', required: false },
    { name: 'message', label: 'Message', type: 'textarea', required: true }
  ];

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
            {errors.form && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                <X className="w-5 h-5 mr-2" />
                {errors.form}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {formFields.map((field) => (
                <div key={field.name} className="relative">
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                    {field.label} {field.required && '*'}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      id={field.name}
                      name={field.name}
                      rows={4}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className={getInputClassName(field.name)}
                      placeholder={`Enter your ${field.label.toLowerCase()}...`}
                    />
                  ) : (
                    <input
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]} 
                      onChange={handleChange}
                      className={getInputClassName(field.name)}
                      placeholder={`Enter your ${field.label.toLowerCase()}...`}
                    />
                  )}
                  {validFields[field.name] && (
                    <Check className="absolute right-3 top-8 w-5 h-5 text-green-500" />
                  )}
                  {errors[field.name] && (
                    <div className="mt-1 flex items-center text-sm text-red-500">
                      <X className="w-4 h-4 mr-1" />
                      {errors[field.name]}
                    </div>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;