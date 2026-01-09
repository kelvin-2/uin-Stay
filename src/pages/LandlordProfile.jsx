import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, User, Phone, Mail, ArrowLeft, Loader2, Building2, Home, Calendar, MapPin } from 'lucide-react';
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

  const getInitials = (name) => {
    if (!name) return 'LL';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <LandlordNavbar />
      <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>

          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            {/* Blue gradient background */}
            <div className="relative bg-gradient-to-r from-blue-500 to-blue-700 h-48 sm:h-56">
              {/* Profile info overlay - positioned at bottom */}
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  {/* Left side: Avatar and name */}
                  <div className="flex items-end gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-xl flex items-center justify-center text-blue-600 text-3xl sm:text-4xl font-bold shadow-lg">
                        {getInitials(profile.full_name)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                    </div>

                    {/* Name and title */}
                    <div className="text-white pb-1">
                      <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                        {profile.full_name || 'Landlord'}
                      </h1>
                      <div className="flex items-center gap-2 text-blue-100 mb-2">
                        <Building2 size={16} />
                        <span className="font-medium">UniStay Property Manager</span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-blue-50">
                        <span className="flex items-center gap-1">
                          <Home size={14} />
                          {profile.properties} Properties
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Building2 size={14} />
                          {profile.totalUnits} Units
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          Since {profile.joinDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Edit button */}
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <button
                        onClick={handleEdit}
                        className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-lg font-medium shadow-lg transition-all duration-200 flex items-center gap-2"
                      >
                        <Edit2 size={18} />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleSave}
                          disabled={isLoading}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                        >
                          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                          <span>{isLoading ? 'Saving...' : 'Save'}</span>
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={isLoading}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                        >
                          <X size={18} />
                          <span>Cancel</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Information - Left side (2/3) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="text-blue-600" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                </div>

                <div className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.full_name}
                        onChange={e => handleInputChange('full_name', e.target.value)}
                        className="w-full border-2 border-gray-200 focus:border-blue-500 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        <User className="text-gray-400 flex-shrink-0" size={20} />
                        <p className="text-gray-900">{profile.full_name || 'Not provided'}</p>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={e => handleInputChange('email', e.target.value)}
                        className="w-full border-2 border-gray-200 focus:border-blue-500 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Mail className="text-gray-400 flex-shrink-0" size={20} />
                        <p className="text-gray-900 break-all">{profile.email || 'Not provided'}</p>
                      </div>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.phone_number}
                        onChange={e => handleInputChange('phone_number', e.target.value)}
                        className="w-full border-2 border-gray-200 focus:border-blue-500 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <Phone className="text-gray-400 flex-shrink-0" size={20} />
                          <p className="text-gray-900">{profile.phone_number || 'Not provided'}</p>
                        </div>
                        {profile.phone_number && (
                          <a
                            href={`https://wa.me/${profile.phone_number.replace(/\s/g, '').replace('+', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            <span>WhatsApp</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Portfolio Stats */}
            <div className="space-y-6">
              {/* Your Portfolio Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center gap-2 mb-6">
                  <Building2 size={20} />
                  <h2 className="text-lg font-bold">Your Portfolio</h2>
                </div>
                
                <div className="space-y-4">
                  {/* Total Properties */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-100 text-sm">Total Properties</span>
                      <Home className="text-blue-200" size={18} />
                    </div>
                    <div className="text-4xl font-bold">{profile.properties}</div>
                  </div>

                  {/* Total Units */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-100 text-sm">Total Units</span>
                      <Building2 className="text-blue-200" size={18} />
                    </div>
                    <div className="text-4xl font-bold">{profile.totalUnits}</div>
                  </div>
                </div>
              </div>

              {/* Account Info Card */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Account Info</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Role</span>
                    <span className="text-sm font-semibold text-gray-900 bg-blue-50 px-3 py-1 rounded-lg">
                      {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Member Since</span>
                    <span className="text-sm font-semibold text-gray-900">{profile.joinDate}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 text-sm">Status</span>
                    <span className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-semibold text-green-600">Active</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 flex flex-col items-center space-y-4 shadow-2xl max-w-sm mx-4">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <div className="text-center">
                  <p className="text-gray-900 font-semibold text-lg">Updating Profile</p>
                  <p className="text-gray-500 text-sm">Please wait...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LandlordProfile;