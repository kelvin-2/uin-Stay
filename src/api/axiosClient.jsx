import axios from 'axios';

// // // in development 
const API_URL = 'http://localhost:3002/api';


//this is in production 
// const API_URL = 'https://emanzinibackend.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 40000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;