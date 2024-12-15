import mongoose from "mongoose";
import Appointment from "../models/appointment.model.js";

// Fetch all appointments
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({});
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    console.log("Error in fetching appointments:", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Server Error - Fetching appointments failed",
      });
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
    status,
    scheduledDate,
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
      .json({ success: false, message: "Please provide all required fields" });
  }

  // Handle default status and scheduledDate if not provided
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
    status: status || "Unscheduled", // Default to "Unscheduled" if no status is provided
    scheduledDate: scheduledDate || null, // Default to null if no scheduledDate is provided
  });

  try {
    await newAppointment.save();
    res.status(201).json({ success: true, data: newAppointment });
  } catch (error) {
    console.error("Error in creating appointment:", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Server Error - Creating appointment failed",
      });
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
    console.error("Error in deleting appointment:", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Server Error - Deleting appointment failed",
      });
  }
};

// Update appointment details
export const updateAppointments = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Appointment Not Found" });
  }

  // Ensure required fields are provided for updates
  const { status, scheduledDate } = updatedData;
  if (status && !["Scheduled", "Unscheduled"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status value. Must be 'Scheduled' or 'Unscheduled'",
    });
  }

  if (status === "Scheduled" && !scheduledDate) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Scheduled date must be provided for 'Scheduled' status",
      });
  }

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedAppointment });
  } catch (error) {
    console.error("Error in updating appointment:", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Server Error - Updating appointment failed",
      });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status, scheduledDate } = req.body;

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

  // Validate status value
  if (!["Scheduled", "Unscheduled"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status value. Must be 'Scheduled' or 'Unscheduled'",
    });
  }

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status, scheduledDate },
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedAppointment });
  } catch (error) {
    console.error("Error updating appointment status:", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Server Error - Updating appointment status failed",
      });
  }
};
