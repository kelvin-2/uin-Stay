import axios from 'axios';

// // // in development 
const API_URL = 'http://localhost:3002/api';
// const API_URL = 'https://uinstaybackend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 40000,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or however you store it
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
