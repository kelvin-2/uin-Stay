import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, User, Phone, Mail, MapPin, Calendar, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AutContext'; // Import your auth context
import { useNavigate } from 'react-router-dom';

const LandlordProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, updateUserProfile } = useAuth(); // Use your auth context
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    role: 'landlord',
    created_at: '',
    auth_id: '',
    university: '',
    properties: 0,
    totalUnits: 0
  });

  const [editForm, setEditForm] = useState({ ...profile });

  // Load profile data from auth context
  useEffect(() => {
    if (currentUser) {
      const formattedProfile = {
        full_name: currentUser.fullName || '',
        email: currentUser.email || '',
        phone_number: currentUser.phoneNumber || '',
        role: currentUser.role || 'landlord',
        created_at: currentUser.createdAt || '',
        auth_id: currentUser.uid || '',
        university: currentUser.university || '',
        joinDate: currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        }) : 'Recently',
        properties: currentUser.properties || 0,
        totalUnits: currentUser.totalUnits || 0
      };
      setProfile(formattedProfile);
      setEditForm(formattedProfile);
    }
  }, [currentUser]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...profile });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Use your auth context's update method
      await updateUserProfile({
        fullName: editForm.full_name,
        email: editForm.email,
        phoneNumber: editForm.phone_number,
        university: editForm.university
      });

      setProfile({ ...editForm });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20"> {/* Added pt-20 for navbar spacing */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white mb-8 shadow-lg">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                {profile.full_name ? (
                  <span className="text-2xl font-bold text-white">
                    {profile.full_name.split(' ').map(n => n[0]).join('')}
                  </span>
                ) : (
                  <User size={40} className="text-white" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{profile.full_name || 'Loading...'}</h1>
                <p className="text-blue-100 text-lg">UinStay Landlord</p>
                <div className="flex space-x-6 mt-2 text-sm text-blue-100">
                  <span>{profile.properties} Properties</span>
                  <span>{profile.totalUnits} Units</span>
                  <span>Since {profile.joinDate}</span>
                </div>
              </div>
            </div>
          
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 border border-white/30"
            >
              <Edit2 size={16} />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>{isLoading ? 'Saving...' : 'Save'}</span>
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="grid md:grid-cols-2 gap-8 p-8">
        <div className="space-y-6">
          <div className="bg-white border border-blue-100 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-blue-900 border-b border-blue-100 pb-3">Contact Information</h2>
            
            <div className="space-y-5">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="text-blue-600" size={18} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-blue-700 mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.full_name || ''}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-blue-900 font-medium text-lg">{profile.full_name}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="text-blue-600" size={18} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-blue-700 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-blue-900 font-medium">{profile.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Phone className="text-blue-600" size={18} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-blue-700 mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone_number || ''}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+27 82 123 4567"
                    />
                  ) : (
                    <div className="flex items-center space-x-3">
                      <p className="text-blue-900 font-medium">{profile.phone_number}</p>
                      {profile.phone_number && (
                        <a
                          href={`https://wa.me/${profile.phone_number.replace(/\s/g, '').replace('+', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm bg-blue-50 px-3 py-1 rounded-full transition-colors"
                        >
                          WhatsApp
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-blue-100 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 text-blue-900 border-b border-blue-100 pb-3">Additional Details</h2>
            
            <div className="space-y-5">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="text-blue-600" size={18} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-blue-700 mb-2">University</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.university || ''}
                      onChange={(e) => handleInputChange('university', e.target.value)}
                      className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="University of Cape Town"
                    />
                  ) : (
                    <p className="text-blue-900 font-medium">{profile.university || 'Not specified'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-blue-600" size={18} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-blue-700 mb-2">Member Since</label>
                  <p className="text-blue-900 font-medium">{profile.joinDate}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <h2 className="text-xl font-semibold mb-6 text-blue-900">UinStay Portfolio</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-blue-100">
                <div className="text-3xl font-bold text-blue-600 mb-1">{profile.properties}</div>
                <div className="text-sm text-blue-700 font-medium">Properties</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-blue-100">
                <div className="text-3xl font-bold text-blue-600 mb-1">{profile.totalUnits}</div>
                <div className="text-sm text-blue-700 font-medium">Total Units</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-white text-sm font-bold">!</span>
            </div>
            <div>
              <p className="text-blue-800 font-medium mb-1">Profile Update Notice</p>
              <p className="text-sm text-blue-700">
                Changes to your contact information will be updated across all your UinStay property listings and tenant communications.
              </p>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 flex items-center space-x-3 shadow-lg">
            <Loader2 className="animate-spin text-blue-600" size={24} />
            <span className="text-blue-900 font-medium">Updating profile...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandlordProfile;