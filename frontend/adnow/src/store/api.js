import axios from "axios";

// Conditionally set the API URL based on the environment
const api = axios.create({
  baseURL: "https://adnow.onrender.com/api",
  withCredentials: true, // Allow cookies and session data
});

api.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

export default api;
