import express from "express";
import {
  getPatients,
  createPatient,
  deletePatient,
  updatePatient,
} from "../controllers/patient.controller.js";

const router = express.Router();

// Get all patients
router.get("/", getPatients);

// Create a new patient
router.post("/", createPatient);

// Delete a patient by ID
router.delete("/:id", deletePatient);

// Update patient details by ID
router.patch("/:id", updatePatient);

export default router;
