import axios from "axios";

const publicApi = axios.create({
  baseURL: "http://localhost:3002/api",
  timeout: 40000,
});

export default publicApi;
