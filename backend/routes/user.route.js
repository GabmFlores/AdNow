import express from "express";
import {
  createUser,
  loginUser,
  deleteUser,
  getUsers,
  getUsersById,
  logoutUser,
  updateUser,
  getAuthenticatedUser,
  getPasswordById,
} from "../controllers/user.controller.js";

const router = express.Router();

// Define routes for user operations
router.get("/", getUsers); // Fetch all users
router.get("/auth", getAuthenticatedUser);
router.get("/password/:id", getPasswordById);
router.get("/:id", getUsersById); // Fetch all users
router.post("/logout", logoutUser); // logout user
router.post("/", createUser);
router.post("/login", loginUser); // Create a new user
router.delete("/:id", deleteUser); // Delete a user by ID
router.patch("/:id", updateUser); // Update a user by ID

export default router;
