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
import path from "path";

// Load environment variables
dotenv.config();

const app = express();

// CORS Setup
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Replace with your frontend URL
  credentials: true, // Allow cookies and authentication
};
app.use(cors(corsOptions));

const __dirname = path.resolve();

// Session Setup
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Used to sign the session cookie
    resave: false, // Don't resave session if unmodified
    saveUninitialized: false, // Don't save empty sessions
    rolling: true, // Reset expiration on every request
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }), // Store sessions in MongoDB
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: process.env.NODE_ENV === "production", // Secure cookies only in production
      httpOnly: true, // Prevent JavaScript access to the cookie
      sameSite: "Strict", // Prevent cross-site request forgery
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

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/adnow/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend/adnow/dist", "index.html"));
  });
}

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server started at http://localhost:${PORT}`);
});
