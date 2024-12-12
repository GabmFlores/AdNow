import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import appointmentRoutes from "./routes/appointment.route.js";
import columnRoutes from "./routes/column.route.js";
import userRoutes from "./routes/user.route.js";
import patientRoutes from "./routes/patient.route.js";
import session from "express-session";
import MongoStore from "connect-mongo";

// Load environment variables
dotenv.config();

const app = express();

// CORS Setup
const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend URL
  credentials: true, // Allow cookies and authentication
};
app.use(cors(corsOptions));

// Session Setup
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Used to sign the session cookie
    resave: false, // Don't resave session if unmodified
    saveUninitialized: false, // Don't save empty sessions
    rolling: true, // Reset expiration on every request
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }), // Store sessions in MongoDB
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Cookie expiration time (1 day)
      secure: false, // Set to true if using HTTPS
    },
  })
);

// Middleware for JSON parsing
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/columns", columnRoutes);

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server started at http://localhost:${PORT}`);
});
