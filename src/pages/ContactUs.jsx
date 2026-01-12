import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import ContactInfo from '../components/ContactInfo';
import supabase from '../supabaseClient';

const ContactUs = () => {
  const initialFormState = {
    name: '',
    email_address: '',
    phoneNumber: '',
    subject: '',
    message: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [validFields, setValidFields] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const patterns = {
    name: /^[a-zA-Z\s]{2,30}$/,
    email_address: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    phoneNumber: /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
    message: /.{10,}/
  };

  const validationMessages = {
    name: {
      pattern: 'Name should only contain letters and spaces (2–30 characters)',
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

  const validateField = (name, value) => {
    if (!value.trim() && ['name', 'email_address', 'message'].includes(name)) {
      return validationMessages[name].required;
    }
    if (patterns[name] && value.trim() && !patterns[name].test(value.trim())) {
      return validationMessages[name].pattern;
    }
    return '';
  };

  useEffect(() => {
    const newValid = {};
    const newErrors = {};

    Object.keys(formData).forEach(field => {
      if (formData[field].trim()) {
        const error = validateField(field, formData[field]);
        if (!error) newValid[field] = true;
        else newErrors[field] = error;
      }
    });

    setValidFields(newValid);
    setErrors(newErrors);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email_address: formData.email_address.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        ...(formData.phoneNumber.trim() && { phoneNumber: formData.phoneNumber.trim() })
      };

      const { error } = await supabase.from('Contact').insert([payload]);
      if (error) throw error;

      setFormData(initialFormState);
      setValidFields({});
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch {
      setErrors({ form: 'Failed to submit the form. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const inputClass = (field) => {
    const base = `
      mt-1 w-full rounded-lg border px-4 py-3
      bg-white/60 backdrop-blur-md
      text-gray-900 font-medium
      placeholder:text-gray-500
      focus:outline-none focus:ring-2 transition
    `;

    if (errors[field]) return `${base} border-red-400 focus:ring-red-400`;
    if (validFields[field]) return `${base} border-green-400 focus:ring-green-400`;
    return `${base} border-white/40 focus:ring-blue-500`;
  };

  const fields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email_address', label: 'Email', type: 'email', required: true },
    { name: 'phoneNumber', label: 'Phone', type: 'text' },
    { name: 'subject', label: 'Subject', type: 'text' },
    { name: 'message', label: 'Message', type: 'textarea', required: true }
  ];

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-4">
            Contact Us
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Have questions about student housing? We’re here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Glass Contact Info */}
          <div className="
            rounded-2xl
            border border-white/30
            bg-white/30
            backdrop-blur-xl
            shadow-xl
            p-8
            text-gray-900
          ">
            <ContactInfo />
          </div>

          {/* Glass Form */}
          <div className="
            rounded-2xl
            border border-white/30
            bg-white/30
            backdrop-blur-xl
            shadow-xl
            p-8
            font-inter
          ">

            {submitSuccess && (
              <div className="mb-6 flex items-center rounded-lg bg-green-500/10 text-green-700 px-4 py-3 font-medium">
                <Check className="w-5 h-5 mr-2" />
                Message sent successfully!
              </div>
            )}

            {errors.form && (
              <div className="mb-6 flex items-center rounded-lg bg-red-500/10 text-red-600 px-4 py-3 font-medium">
                <X className="w-5 h-5 mr-2" />
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {fields.map(field => (
                <div key={field.name} className="relative">
                  <label className="block text-sm font-semibold text-gray-900">
                    {field.label}{field.required && ' *'}
                  </label>

                  {field.type === 'textarea' ? (
                    <textarea
                      rows={4}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className={inputClass(field.name)}
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className={inputClass(field.name)}
                    />
                  )}

                  {validFields[field.name] && (
                    <Check className="absolute right-3 top-9 w-5 h-5 text-green-500" />
                  )}

                  {errors[field.name] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center font-medium">
                      <X className="w-4 h-4 mr-1" />
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={isLoading}
                className="
                  w-full rounded-lg
                  bg-blue-600 py-3
                  font-bold text-white
                  hover:bg-blue-700
                  transition
                  disabled:opacity-50
                "
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
