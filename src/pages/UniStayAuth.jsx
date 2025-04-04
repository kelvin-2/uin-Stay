import React, { useState } from 'react';
import { Building, User, Mail, Lock, Home, BookOpen, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AutContext';
import supabase from '../supabaseClient';

const UniStayAuth = () => {
  const [userType, setUserType] = useState('student');
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    university: '',
    phone: '',
    location: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (activeTab === 'signup') {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      }

      if (userType === 'student' && !formData.university) {
        newErrors.university = 'University is required';
      }

      if (userType === 'landlord') {
        if (!formData.phone) {
          newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[0-9]{10,}$/.test(formData.phone)) {
          newErrors.phone = 'Invalid phone number format';
        }

        if (!formData.location) {
          newErrors.location = 'Location is required';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    
    try {
      // Step 1: Sign in the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (error) throw error;
      
      // Get user ID from the authentication response
      const userId = data.user?.id;
      if (!userId) {
        throw new Error("Unable to retrieve user information after login.");
      }
      
      console.log("Auth ID retrieved:", userId);
      
      await new Promise((resolve) => setTimeout(resolve,2000)); //await 2 seconds

      // Add debugging step: Check auth session
      const { data: sessionData } = await supabase.auth.getSession();
      console.log("Current session:", sessionData);

      
      // Step 2: First try to fetch ANY users to see if database access works
      // const { data: anyUsers, error: anyError } = await supabase
      //   .from("users")
      //   .select("*")
      //   .limit(1);
        
      
      // console.log("Database connectivity check:", anyUsers, anyError);
      
      // // Step 3: Now try to fetch directly with the auth_id
      // // Log the exact query we're about to run
      // console.log("Running query: SELECT * FROM users WHERE auth_id = '" + userId + "'");
      
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", userId)
        .maybeSingle();
      
      console.log("Query result:", userData);
      console.log("Query error:", userError);
      
      if (userError) {
        console.error("Database query error:", userError);
        throw new Error("Database error: " + userError.message);
      }
      
      // Check if user data exists
      if (!userData) {
        // Try an alternative approach - fetch with email instead of auth_id
        console.log("User not found with auth_id, trying email lookup");
        const userEmail = data.user?.email;
        
        const { data: emailLookup, error: emailError } = await supabase
          .from("users")
          .select("*")
          .eq("email", userEmail)
          .maybeSingle();
          
        console.log("Email lookup result:", emailLookup);
        
        if (emailLookup) {
          console.log("Found user by email instead of auth_id!");
          // This indicates a mismatch between auth_id in Auth and users table
          // We should proceed with this user, but log the issue
          console.warn("auth_id mismatch - Auth:", userId, "DB user:", emailLookup);
          
          // Option: Update the auth_id in the database to match
          if (confirm("System detected a user account issue. Would you like to repair it?")) {
            const { error: updateError } = await supabase
              .from("users")
              .update({ auth_id: userId })
              .eq("email", userEmail);
              
            console.log("Auth ID update result:", updateError ? "Failed" : "Success");
          }
          
          // Proceed with the email-found user data
          userData = emailLookup;
        } else {
          console.error("User not found in database for auth_id:", userId);
          throw new Error("User profile not found. Please sign up first.");
        }
      }
      
      // Ensure role exists
      if (!userData.role) {
        throw new Error("User role not defined. Please contact support.");
      }
      
      // Step 3: Store user data and login
      const userRole = userData.role;
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("userName", userData.full_name || '');
      
      // Update auth context
      login(userRole);
      
      // Step 4: Redirect based on role
      if (userRole === "landlord") {
        navigate("/landlord-dashboard");
      } else if (userRole === "student") {
        navigate("/student-dashboard");
      } else {
        navigate("/");
      }
      
      console.log("Login successful:", userRole);
      
    } catch (error) {
      console.error("Login error:", error.message);
      setErrors({ auth: error.message || "Login failed. Please try again." });
      
      // Optionally sign out if login was partially successful but profile fetch failed
      const { data } = await supabase.auth.getSession();
      if (data && data.session) {
        await supabase.auth.signOut();
      }
    } finally {
      setLoading(false);
    }
  };


  //option 2 of the login

//   const handleLoginSubmit=async (e) =>{
//     e.preventDefault();
//     if(!validateForm()) return;
//     setLoading(true);

//     try{
//       const {data:authData,error:authErro}= await supabase.auth.signInWithPassword(
//         {
//           email:formData.email,
//           password:formData.password
//         }
//       );
//       if(authErro) throw authErro;

//       await new Promise(resolve => setTimeout(resolve, 1000));

//       //authenticating the session 
//       const {data:{session}}=await supabase.auth.getSession();
//       if(!session) throw new Error("Session not found");

//       const userId = session.user.id ;
//       console.log=("User ID from session:", userId);

//       let retries=3;
//       let userData;

//       while(retries>0){
//         const{data,error}=await supabase
//         .from("users")
//         .select("role")
//         .eq("auth_id",userId)
//         .maybeSingle();

//         if(error) throw error;
//         if(data) {
//           userData=data;
//           break;
//       }
//       retries--;
//       await new Promise(resolve => setTimeout(resolve, 1000));
//     }
//     if(!userData) throw new Error("User not found");

//     const userRole = userData.role;
//     console.log("User role:",userRole);

//     localStorage.setItem("userRole",userRole);
//     login(userRole);

//     const redirectPath = userRole === "landlord" 
//       ? "/landlord-dashboard" 
//       : userRole === "student" 
//         ? "/student-dashboard" 
//         : "/";
//     navigate(redirectPath);
//   }catch (error) {
//     console.error("Login error:", error.message);
//     setErrors({ auth: error.message });
    
//     // Optional: Sign out if login failed
//     await supabase.auth.signOut();
//   } finally {
//     setLoading(false);
//   }
// };
  
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
  
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
  
      if (error) throw error;
      console.log("User session after signup:", data);
  
      const userId = data?.user?.id;
      if (!userId) {
        console.error("No user ID returned after signup!");
        return;
      }
  
      console.log("Inserting user with ID:", userId, "Role:", userType);
  
      const { error: insertError } = await supabase.from("users").insert([
        {
          auth_id: userId,
          full_name: formData.fullName,
          email: formData.email,
          role: userType, // Ensure role is inserted
          university: formData.university || null,
          phone_number: formData.phone || null,
          location: formData.location || null,
          created_at: new Date(),
        },
      ]);
  
      if (insertError) {
        console.error("Error inserting user:", insertError.message);
        throw insertError;
      }
  
      // Wait for role to be available
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 sec delay
  
      console.log("Fetching role after insert...");
      let userRole = userType;
  
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("auth_id", userId)
        .single();
  
      if (userError) {
        console.error("Error fetching role after signup:", userError.message);
      } else {
        console.log("Fetched role:", userData?.role);
        userRole = userData?.role || userType;
      }
  
      console.log("Final user role:", userRole);
      login(userRole);
  
      if (userRole === "landlord") {
        navigate("/landlord-dashboard");
      } else if (userRole === "student") {
        navigate("/student-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ auth: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
              {/* Header */}
              <div className="p-6 space-y-2 text-center border-b border-gray-100">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-500/10 p-3 rounded-full">
                    <Home className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-blue-900">Welcome to UniStay</h2>
                <p className="text-blue-600">Your gateway to student accommodation</p>
              </div>

              <div className="p-6 space-y-4">
                {/* User Type Selection */}
                <div className="flex gap-4 justify-center mb-6">
                  <button
                    onClick={() => setUserType('student')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                      userType === 'student'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'border border-gray-300 hover:bg-blue-50'
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    Student
                  </button>
                  <button
                    onClick={() => setUserType('landlord')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                      userType === 'landlord'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'border border-gray-300 hover:bg-blue-50'
                    }`}
                  >
                    <Building className="h-4 w-4" />
                    Landlord
                  </button>
                </div>

                {/* Tabs */}
                <div className="w-full">
                  <div className="flex rounded-lg bg-blue-50 p-1">
                    <button
                      onClick={() => setActiveTab('login')}
                      className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
                        activeTab === 'login' ? 'bg-blue-600 text-white' : 'text-blue-600'
                      }`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setActiveTab('signup')}
                      className={`flex-1 text-sm font-medium py-2 rounded-md transition-colors ${
                        activeTab === 'signup' ? 'bg-blue-600 text-white' : 'text-blue-600'
                      }`}
                    >
                      Sign up
                    </button>
                  </div>

                  {/* Login Form */}
                  {activeTab === 'login' && (
                    <form onSubmit={handleLoginSubmit} className="space-y-4 mt-4">
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
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          />
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
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
                      >
                        {loading ? "Signing in..." : "Sign in"}
                      </button>
                    </form>
                  )}

                  {/* Signup Form */}
                  {activeTab === 'signup' && (
                    <form onSubmit={handleSignupSubmit} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <label htmlFor="fullName" className="block text-sm font-medium text-blue-900">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                          <input
                            id="fullName"
                            type="text"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          />
                        </div>
                      </div>

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
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          />
                        </div>
                      </div>

                      {userType === 'student' && (
                        <div className="space-y-2">
                          <label htmlFor="university" className="block text-sm font-medium text-blue-900">
                            University/College
                          </label>
                          <div className="relative">
                            <BookOpen className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                            <input
                              id="university"
                              type="text"
                              placeholder="Your University"
                              value={formData.university}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                            />
                          </div>
                        </div>
                      )}

                      {userType === 'landlord' && (
                        <>
                          <div className="space-y-2">
                            <label htmlFor="phone" className="block text-sm font-medium text-blue-900">
                              Phone Number (WhatsApp)
                            </label>
                            <div className="relative">
                              <Phone className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                              <input
                                id="phone"
                                type="tel"
                                placeholder="+44 123 456 7890"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="location" className="block text-sm font-medium text-blue-900">
                              Primary Location
                            </label>
                            <div className="relative">
                              <MapPin className="h-4 w-4 absolute left-3 top-3 text-blue-400" />
                              <input
                                id="location"
                                type="text"
                                placeholder="City"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                              />
                            </div>
                          </div>
                        </>
                      )}

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
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
                      >
                        {loading ? "Creating account..." : "Create account"}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 text-center text-sm text-blue-600">
                {userType === 'student'
                  ? "Find your perfect student home"
                  : "List your properties to thousands of students"
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniStayAuth;