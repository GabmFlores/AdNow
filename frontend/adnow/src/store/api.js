import axios from "axios";

// Set the API URL directly for production
const api = axios.create({
  baseURL: "https://adnow.onrender.com/api", // Hardcoded production API URL
  withCredentials: true, // Allow cookies and session data
});

export default api;
