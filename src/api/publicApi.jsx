import axios from "axios";

const publicApi = axios.create({
  baseURL: "https://uinstaybackend.onrender.com/api",
  timeout: 40000,
});

export default publicApi;
