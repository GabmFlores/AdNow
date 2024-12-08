import express from "express";
import {
  getAppointments,
  createAppointments,
  deleteAppointments,
  updateAppointments,
  updateAppointmentStatus,
} from "../controllers/appointment.controller.js";

const router = express.Router();

// Get all appointments
router.get("/", getAppointments);

// Create a new appointment
router.post("/", createAppointments);

// Delete an appointment by ID
router.delete("/:id", deleteAppointments);

// Update an appointment details by ID
router.put("/:id", updateAppointments);

// Update an appointment status by ID
router.patch("/:id/status", updateAppointmentStatus);

export default router;
