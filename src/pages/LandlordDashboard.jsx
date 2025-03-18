import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandlordProperties from './components/LandlordProperties';
import supabase from './supabaseClient';
import { 
  Home, 
  Users, 
  MessageSquare, 
  FileText, 
  Settings, 
  LogOut, 
  DollarSign, 
  AlertCircle, 
  ChevronDown,
  Bell,
  Search
} from 'lucide-react';

const LandlordDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('properties');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(3);
  const [stats, setStats] = useState({
    totalProperties: 0,
    occupiedProperties: 0,
    pendingRequests: 0,
    unreadMessages: 0,
  });
  
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get additional user data from profiles table
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          setUser({ ...user, ...profileData });
          
          // Fetch dashboard stats
          fetchDashboardStats(user.id);
        } else {
          // Redirect to login if no user
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);
  
  // Fetch dashboard statistics
  const fetchDashboardStats = async (userId) => {
    try {
      // Get total properties count
      const { data: properties, error: propError } = await supabase
        .from('properties')
        .select('id, status')
        .eq('landlordId', userId);
        
      if (propError) throw propError;
      
      // Get unread messages count
      const { count: unreadCount, error: msgError } = await supabase
        .from('messages')
        .select('id', { count: 'exact' })
        .eq('recipientId', userId)
        .eq('read', false);
        
      if (msgError) throw msgError;
      
      // Get pending requests count
      const { count: requestsCount, error: reqError } = await supabase
        .from('requests')
        .select('id', { count: 'exact' })
        .eq('landlordId', userId)
        .eq('status', 'pending');
        
      if (reqError) throw reqError;
      
      setStats({
        totalProperties: properties?.length || 0,
        occupiedProperties: properties?.filter(p => p.status === 'occupied').length || 0,
        pendingRequests: requestsCount || 0,
        unreadMessages: unreadCount || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-blue-800 text-white">
        <div className="p-4 border-b border-blue-700">
          <h2 className="text-2xl font-bold">UinStay</h2>
          <p className="text-blue-300 text-sm">Landlord Portal</p>
        </div>
        
        <div className="p-4 border-b border-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'L'}
            </div>
            <div>
              <p className="font-medium">{user?.name || user?.email}</p>
              <p className="text-sm text-blue-300">Landlord</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveTab('properties')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  activeTab === 'properties' ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700'
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Properties</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('tenants')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  activeTab === 'tenants' ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700'
                }`}
              >
                <Users className="h-5 w-5" />
                <span>Tenants</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('messages')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  activeTab === 'messages' ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700'
                }`}
              >
                <MessageSquare className="h-5 w-5" />
                <span>Messages</span>
                {stats.unreadMessages > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {stats.unreadMessages}
                  </span>
                )}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('payments')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  activeTab === 'payments' ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700'
                }`}
              >
                <DollarSign className="h-5 w-5" />
                <span>Payments</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('documents')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  activeTab === 'documents' ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700'
                }`}
              >
                <FileText className="h-5 w-5" />
                <span>Documents</span>
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 mt-auto border-t border-blue-700">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  activeTab === 'settings' ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-700'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
            </li>
            <li>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 p-3 rounded-lg text-blue-200 hover:bg-blue-700"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <div className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center md:hidden">
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h2 className="text-xl font-bold text-gray-800 ml-2">UinStay</h2>
            </div>
            
            <div className="relative w-64 hidden md:block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center">
              <button className="p-2 text-gray-500 hover:text-gray-700 relative">
                <Bell className="h-6 w-6" />
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              
              <div className="relative ml-3">
                <button className="flex items-center space-x-2 text-sm focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'L'}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="font-medium">{user?.name || 'Landlord'}</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Home className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">Total Properties</p>
                  <h3 className="font-bold text-2xl">{stats.totalProperties}</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">Occupied Properties</p>
                  <h3 className="font-bold text-2xl">{stats.occupiedProperties}</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="bg-amber-100 p-3 rounded-full">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">Pending Requests</p>
                  <h3 className="font-bold text-2xl">{stats.pendingRequests}</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">Unread Messages</p>
                  <h3 className="font-bold text-2xl">{stats.unreadMessages}</h3>
                </div>
              </div>
            </div>
          </div>
          
          {/* Active Tab Content */}
          <div className="bg-white rounded-lg shadow">
            {activeTab === 'properties' && (
              <div>
                <div className="border-b p-4">
                  <h2 className="text-lg font-semibold">My Properties</h2>
                </div>
                <div className="p-4">
                  <LandlordProperties landlordId={user?.id} />
                </div>
              </div>
            )}
            
            {activeTab === 'tenants' && (
              <div>
                <div className="border-b p-4">
                  <h2 className="text-lg font-semibold">My Tenants</h2>
                </div>
                <div className="p-8 text-center text-gray-500">
                  <Users className="h-16 w-16 mx-auto text-gray-300" />
                  <p className="mt-2">Tenant management features coming soon</p>
                </div>
              </div>
            )}
            
            {activeTab === 'messages' && (
              <div>
                <div className="border-b p-4">
                  <h2 className="text-lg font-semibold">Messages</h2>
                </div>
                <div className="p-8 text-center text-gray-500">
                  <MessageSquare className="h-16 w-16 mx-auto text-gray-300" />
                  <p className="mt-2">Messaging features coming soon</p>
                </div>
              </div>
            )}
            
            {activeTab === 'payments' && (
              <div>
                <div className="border-b p-4">
                  <h2 className="text-lg font-semibold">Payment History</h2>
                </div>
                <div className="p-8 text-center text-gray-500">
                  <DollarSign className="h-16 w-16 mx-auto text-gray-300" />
                  <p className="mt-2">Payment tracking features coming soon</p>
                </div>
              </div>
            )}
            
            {activeTab === 'documents' && (
              <div>
                <div className="border-b p-4">
                  <h2 className="text-lg font-semibold">Documents</h2>
                </div>
                <div className="p-8 text-center text-gray-500">
                  <FileText className="h-16 w-16 mx-auto text-gray-300" />
                  <p className="mt-2">Document management features coming soon</p>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div>
                <div className="border-b p-4">
                  <h2 className="text-lg font-semibold">Account Settings</h2>
                </div>
                <div className="p-8 text-center text-gray-500">
                  <Settings className="h-16 w-16 mx-auto text-gray-300" />
                  <p className="mt-2">Account settings features coming soon</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;