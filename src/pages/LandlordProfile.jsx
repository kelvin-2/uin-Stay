import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, User, Phone, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AutContext';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import LandlordNavbar from '../components/LandlordNavbar';

const LandlordProfile = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    role: 'landlord',
    created_at: '',
    properties: 0,
    totalUnits: 0,
    joinDate: 'Recently'
  });

  const [editForm, setEditForm] = useState({ ...profile });

  useEffect(() => {
    if (currentUser) {
      const fullName = `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim();
      const joinDate = currentUser.createdAt
        ? new Date(currentUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
        : 'Recently';

      const profileData = {
        full_name: fullName || currentUser.fullName || '',
        email: currentUser.email || '',
        phone_number: currentUser.phoneNumber || currentUser.phone_number || '',
        role: currentUser.role || 'landlord',
        created_at: currentUser.createdAt || currentUser.created_at || new Date().toISOString(),
        properties: currentUser.properties || 0,
        totalUnits: currentUser.totalUnits || 0,
        joinDate
      };

      setProfile(profileData);
      setEditForm({
        full_name: profileData.full_name,
        email: profileData.email,
        phone_number: profileData.phone_number
      });
    }
  }, [currentUser]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          auth_id: currentUser.id,
          full_name: editForm.full_name,
          email: editForm.email,
          phone_number: editForm.phone_number,
          role: 'landlord',
          created_at: profile.created_at
        }, { onConflict: 'auth_id' });

      if (error) throw error;

      setProfile({ ...profile, ...editForm });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <>
      <LandlordNavbar />
      <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20">
        <div className="max-w-5xl mx-auto p-4 sm:p-6">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          {/* Header with side-by-side layout */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white mb-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              {/* Left: Avatar */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30 text-2xl font-bold">
                  {profile.full_name
                    ? profile.full_name.split(' ').map(n => n[0]).join('')
                    : <User size={32} className="text-white" />}
                </div>

                {/* Center: Name & Stats */}
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold">{profile.full_name}</h1>
                  <p className="text-blue-100 text-lg sm:text-xl">UniStay Landlord</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs sm:text-sm text-blue-100">
                    <span>{profile.properties} Properties</span>
                    <span>{profile.totalUnits} Units</span>
                    <span>Since {profile.joinDate}</span>
                  </div>
                </div>
              </div>

              {/* Right: Buttons */}
              <div className="flex space-x-3">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg flex items-center space-x-2 border border-white/30"
                  >
                    <Edit2 size={16} />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      <span>{isLoading ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
                    >
                      <X size={16} />
                      <span>Cancel</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Full Name & Email */}
            <div className="space-y-4">
              {/* Full Name */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="text-blue-600" size={16} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-blue-700 mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.full_name}
                      onChange={e => handleInputChange('full_name', e.target.value)}
                      className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-blue-900 font-medium">{profile.full_name}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="text-blue-600" size={16} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-blue-700 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-blue-900 break-all">{profile.email}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Phone className="text-blue-600" size={16} />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone_number}
                      onChange={e => handleInputChange('phone_number', e.target.value)}
                      className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <>
                      <p className="text-blue-900">{profile.phone_number}</p>
                      {profile.phone_number && (
                        <a
                          href={`https://wa.me/${profile.phone_number.replace(/\s/g, '').replace('+', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm bg-blue-50 px-3 py-1 rounded-full"
                        >
                          WhatsApp
                        </a>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 h-full flex flex-col justify-center">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">UniStay Portfolio</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600">{profile.properties}</div>
                  <div className="text-sm text-blue-700 font-medium">Properties</div>
                </div>
                <div className="text-center bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600">{profile.totalUnits}</div>
                  <div className="text-sm text-blue-700 font-medium">Total Units</div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-4 flex items-center space-x-3 shadow-lg">
                <Loader2 className="animate-spin text-blue-600" size={24} />
                <span className="text-blue-900 font-medium">Updating profile...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LandlordProfile;
