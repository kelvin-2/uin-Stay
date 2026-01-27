import axios from "axios";
// const API_URL = 'http://localhost:3005/api';
const publicApi = axios.create({
  baseURL: "https://uinstaybackend.onrender.com/api",
  timeout: 40000,
});

export default publicApi;
