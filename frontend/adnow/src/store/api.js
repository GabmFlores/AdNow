import axios from "axios";

const api = axios.create({
  baseURL: "https://adnow.onrender.com/api", // Directly set the production URL
  withCredentials: true, // Allow cookies and session data
});

export default api;
