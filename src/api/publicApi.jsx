import axios from "axios";

const publicApi = axios.create({
  baseURL: "https://uinstaybackend-production.up.railway.app/api",
  timeout: 40000,
});

export default publicApi;
