import mongoose from "mongoose";
import Appointment from "../models/appointment.model.js";

// Fetch all appointments
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({});
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    console.log("Error in fetching appointments:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Create a new appointment
export const createAppointments = async (req, res) => {
  const {
    firstName,
    lastName,
    middleName,
    gboxAcc,
    idNum,
    sex,
    department,
    course,
    desiredDate,
    concern,
    status, // Capture status from frontend
  } = req.body;

  // Validate the required fields
  if (
    !firstName ||
    !lastName ||
    !gboxAcc ||
    !idNum ||
    !sex ||
    !desiredDate ||
    !concern
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }

  const scheduledDate = req.body.scheduledDate || desiredDate;

  const newAppointment = new Appointment({
    firstName,
    lastName,
    middleName,
    gboxAcc,
    idNum,
    sex,
    department,
    course,
    desiredDate,
    concern,
    status: status || "Scheduled", // Default to "Scheduled" for admin-created appointments
    scheduledDate, // Make sure scheduledDate is passed correctly
  });

  try {
    await newAppointment.save();
    res.status(201).json({ success: true, data: newAppointment });
  } catch (error) {
    console.error("Error in creating appointment:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete an appointment by ID
export const deleteAppointments = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Appointment Not Found" });
  }

  try {
    await Appointment.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Appointment Deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error in deleting appointment" });
  }
};

// Update appointment details
export const updateAppointments = async (req, res) => {
  const { id } = req.params;
  const appointment = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Appointment Not Found" });
  }

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      appointment,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedAppointment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status, scheduledDate } = req.body; // Expect `scheduledDate` instead of `date`

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Appointment Not Found" });
  }

  if (!status || !scheduledDate) {
    return res.status(400).json({
      success: false,
      message: "Please provide status and scheduled date",
    });
  }

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status, scheduledDate }, // Only update `scheduledDate` and `status`
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedAppointment });
  } catch (error) {
    console.error("Error updating appointment status:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
