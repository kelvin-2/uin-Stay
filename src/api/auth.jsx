import api from './axiosClient'; 

export const createUser = async (userData) => {
  try {
    console.log('Attempting to create user with:', { 
      email: userData.email,
      user_name: userData.user_name,
      first_name: userData.first_name,
      last_name: userData.last_name,
      role: userData.role,
      university: userData.university,
      phone_number: userData.phone_number
    });
    
    const response = await api.post('/api/auth/createUser', {
      email: userData.email,
      user_name: userData.user_name,
      first_name: userData.first_name,
      last_name: userData.last_name,
      password: userData.password,
      role: userData.role, // 'student' or 'landlord'
      phone_number: userData.phone_number,
      university: userData.university
    });

    const data = response.data;
    console.log('User created successfully:', data);

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
    
  } catch (error) {
    console.error('Create user error:', error);
    console.error('Response data:', error.response?.data);
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to server. Please check if the server is running.');
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    
    // Handle different HTTP status codes
    if (error.response) {
      const status = error.response.status;
      const errorMessage = error.response.data?.error || error.response.data?.message;
      
      switch (status) {
        case 400:
          throw new Error(errorMessage || 'Invalid user data provided');
        case 409:
          throw new Error(errorMessage || 'User already exists');
        case 500:
          throw new Error(errorMessage || 'Server error occurred');
        default:
          throw new Error(errorMessage || 'User creation failed');
      }
    }
    
    throw new Error('Network error. Please check your connection.');
  }
};

export const loginUser = async (email, password) => {
  try {
    console.log('Attempting login with:', { email });
    
    const response = await api.post('/api/auth/login', {
      email,
      password
    });

    const data = response.data;
    
    // Store token and user info
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
    
  } catch (error) {
    console.error('Login error:', error);
    console.error('Response data:', error.response?.data);
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to server. Please check if the server is running.');
    }
    
    if (error.response) {
      const status = error.response.status;
      const errorMessage = error.response.data?.error || error.response.data?.message;
      
      switch (status) {
        case 400:
          throw new Error(errorMessage || 'Invalid credentials');
        case 401:
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        case 404:
          throw new Error('User not found. Please sign up first.');
        case 500:
          throw new Error(errorMessage || 'Server error occurred');
        default:
          throw new Error(errorMessage || 'Login failed');
      }
    }
    
    throw new Error('Network error. Please check your connection.');
  }
};

export const changePassword = async (data) => {
  try {
    console.log('Attempting password change with:', { staffNumber: data.staffNumber });
    
    const response = await api.post('/update', {
      staffNumber: data.staffNumber,
      oldPassword: data.oldPassword,
      newPassword: data.newPassword
    });

    const responseData = response.data;
    console.log('Password change successful:', responseData);
    
    // Only update localStorage if new token is provided
    if (responseData.token) {
      localStorage.setItem('token', responseData.token);
    }
    if (responseData.staff) {
      localStorage.setItem('user', JSON.stringify(responseData.staff));
    }
    
    return responseData;

  } catch (error) {
    console.error('Change password error:', error);
    console.error('Response data:', error.response?.data);
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to server. Please check if the server is running.');
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    
    // Handle different HTTP status codes
    if (error.response) {
      const status = error.response.status;
      const errorMessage = error.response.data?.error || error.response.data?.message;
      
      switch (status) {
        case 400:
          throw new Error(errorMessage || 'Invalid request data');
        case 401:
          throw new Error(errorMessage || 'Current password is incorrect');
        case 404:
          throw new Error(errorMessage || 'Staff member not found');
        case 500:
          throw new Error(errorMessage || 'Server error occurred');
        default:
          throw new Error(errorMessage || 'Password change failed');
      }
    }
    
    throw new Error('Network error. Please check your connection.');
  }
};

