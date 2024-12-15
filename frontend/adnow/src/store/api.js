import axios from "axios";

// Conditionally set the API URL based on the environment
const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "/api"
      : "http://localhost:5002/api", // Default to local URL in development
  withCredentials: true, // Allow cookies and session data
});

api.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

export default api;
