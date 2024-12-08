import express from "express";
import {
  createAppointments,
  deleteAppointments,
  getAppointments,
  updateAppointments,
} from "../controllers/appointment.controller.js";
const router = express.Router();

router.get("/", getAppointments);
router.post("/", createAppointments);
router.delete("/:id", deleteAppointments);
router.patch("/:id", updateAppointments);
export default router;
