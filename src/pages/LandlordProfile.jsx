import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, User, Phone, Mail, MapPin, Calendar, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AutContext';
import { useNavigate } from 'react-router-dom';
import supabase  from '../supabaseClient';
import LandlordNavbar from '../components/LandlordNavbar';

const LandlordProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    university: '',
    role: 'landlord',
    created_at: '',
    auth_id: '',
    properties: 0,
    totalUnits: 0,
    joinDate: 'Recently'
  });

  const [editForm, setEditForm] = useState({ ...profile });

  // Fetch landlord profile and stats from Supabase
  const fetchLandlordProfile = async () => {
    try {
      setDataLoading(true);
      
      // Get the current Supabase user (not Firebase user)
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('Error getting Supabase user:', authError);
        return;
      }

      console.log('Supabase user:', user);
      
      // Fetch user profile using Supabase user ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', user.id) // Use Supabase user.id, not Firebase currentUser.uid
        .single();

      console.log('User data:', userData);

      if (userError && userError.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching user data:', userError);
      }

      // Fetch accommodation stats
      const { data: accommodationData, error: accommodationError } = await supabase
        .from('accommodation')
        .select('id, room_type')
        .eq('landlord_id', user.id); // Use Supabase user.id

      if (accommodationError) {
        console.error('Error fetching accommodation data:', accommodationError);
      }

      console.log('Accommodation data:', accommodationData);

      // Calculate stats
      const properties = accommodationData?.length || 0;
      const totalUnits = accommodationData?.reduce((total, acc) => {
        return total + 1;
      }, 0) || 0;

      const formattedProfile = {
        full_name: userData?.full_name || user?.user_metadata?.full_name || '',
        email: userData?.email || user?.email || '',
        phone_number: userData?.phone_number || '',
        role: userData?.role || 'landlord',
        created_at: userData?.created_at || new Date().toISOString(),
        auth_id: userData?.auth_id || user.id,
        properties,
        totalUnits,
        joinDate: userData?.created_at 
          ? new Date(userData.created_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long' 
            }) 
          : 'Recently'
      };

      setProfile(formattedProfile);
      setEditForm(formattedProfile);
    } catch (error) {
      console.error('Error fetching landlord profile:', error);
    } finally {
      setDataLoading(false);
    }
  };

  // Load profile data when component mounts
  useEffect(() => {
    // Don't depend on currentUser from Firebase, use Supabase auth directly
    fetchLandlordProfile();
  }, []); // Remove currentUser dependency

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...profile });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Get current Supabase user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Update user profile in Supabase
      const { data, error } = await supabase
        .from('users')
        .upsert({
          auth_id: user.id, // Use Supabase user.id
          full_name: editForm.full_name,
          email: editForm.email,
          phone_number: editForm.phone_number,
          role: 'landlord',
          created_at: profile.created_at || new Date().toISOString()
        }, {
          onConflict: 'auth_id'
        });

      if (error) throw error;

      // Update local state
      const updatedProfile = {
        ...profile,
        full_name: editForm.full_name,
        email: editForm.email,
        phone_number: editForm.phone_number,
      };
      
      setProfile(updatedProfile);
      setIsEditing(false);
      
      // Show success message
      alert('Profile updated successfully!');
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

  // Show loading state while data is loading
  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
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
      <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          {/* Back Navigation */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4 sm:mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-4 sm:p-6 lg:p-8 text-white mb-6 sm:mb-8 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30 flex-shrink-0">
                  {profile.full_name ? (
                    <span className="text-xl sm:text-2xl font-bold text-white">
                      {profile.full_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  ) : (
                    <User size={32} className="text-white sm:w-10 sm:h-10" />
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold">{profile.full_name || 'Loading...'}</h1>
                  <p className="text-blue-100 text-base sm:text-lg">UniStay Landlord</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 mt-2 text-xs sm:text-sm text-blue-100">
                    <span>{profile.properties} Properties</span>
                    <span>{profile.totalUnits} Units</span>
                    <span>Since {profile.joinDate}</span>
                  </div>
                </div>
              </div>
            
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="bg-white/20 hover:bg-white/30 px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 border border-white/30 w-full sm:w-auto"
                >
                  <Edit2 size={16} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    <span>{isLoading ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="bg-gray-600 hover:bg-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
              <div className="space-y-6">
                <div className="bg-white border border-blue-100 rounded-xl p-4 sm:p-6 shadow-sm">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-blue-900 border-b border-blue-100 pb-3">Contact Information</h2>
                  
                  <div className="space-y-4 sm:space-y-5">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="text-blue-600" size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="block text-sm font-medium text-blue-700 mb-2">Full Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.full_name || ''}
                            onChange={(e) => handleInputChange('full_name', e.target.value)}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                            placeholder="Enter your full name"
                          />
                        ) : (
                          <p className="text-blue-900 font-medium text-base sm:text-lg break-words">{profile.full_name || 'Not provided'}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <Mail className="text-blue-600" size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="block text-sm font-medium text-blue-700 mb-2">Email</label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editForm.email || ''}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                            placeholder="your@email.com"
                          />
                        ) : (
                          <p className="text-blue-900 font-medium break-all">{profile.email || 'Not provided'}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <Phone className="text-blue-600" size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="block text-sm font-medium text-blue-700 mb-2">Phone Number</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editForm.phone_number || ''}
                            onChange={(e) => handleInputChange('phone_number', e.target.value)}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                            placeholder="+27 82 123 4567"
                          />
                        ) : (
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                            <p className="text-blue-900 font-medium">{profile.phone_number || 'Not provided'}</p>
                            {profile.phone_number && (
                              <a
                                href={`https://wa.me/${profile.phone_number.replace(/\s/g, '').replace('+', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 text-sm bg-blue-50 px-3 py-1 rounded-full transition-colors inline-block text-center"
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
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6 border border-blue-200">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-blue-900">UniStay Portfolio</h2>
                  
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-blue-100">
                      <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{profile.properties}</div>
                      <div className="text-xs sm:text-sm text-blue-700 font-medium">Properties</div>
                    </div>
                    <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-blue-100">
                      <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{profile.totalUnits}</div>
                      <div className="text-xs sm:text-sm text-blue-700 font-medium">Total Units</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50 border border-blue-200 rounded-xl mx-4 sm:mx-6 lg:mx-8 mb-6 sm:mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                  <div>
                    <p className="text-blue-800 font-medium mb-1">Profile Update Notice</p>
                    <p className="text-sm text-blue-700">
                      Changes to your contact information will be updated across all your UniStay property listings and tenant communications.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-4 sm:p-6 flex items-center space-x-3 shadow-lg max-w-sm w-full">
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