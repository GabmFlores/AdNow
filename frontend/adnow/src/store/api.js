// api.js (create this file)
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5002/api", // Correct backend URL
  withCredentials: true, // Allow cookies and session data
});

export default api;
