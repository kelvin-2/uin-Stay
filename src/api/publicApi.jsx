import axios from "axios";
const API_URL = 'http://localhost:3002/api';
// const API_URL = 'https://uinstaybackend.onrender.com/api';
const publicApi = axios.create({
  baseURL: API_URL,
  timeout: 40000,
});

export default publicApi;
