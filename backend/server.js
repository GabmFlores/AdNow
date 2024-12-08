import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import appointmentRoutes from "./routes/appointment.route.js";
import userRoutes from "./routes/user.route.js";
import session from "express-session";
import MongoStore from "connect-mongo";

dotenv.config();

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET, // Used to sign the session cookie
    resave: false, // Whether to save session even if not modified
    saveUninitialized: false, // Don't save empty sessions
    rolling: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }), // Store sessions in MongoDB
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Cookie expiration time
      secure: false,
    },
  })
);

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
const PORT = process.env.PORT;

app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:" + PORT);
});
