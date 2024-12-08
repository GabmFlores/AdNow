import mongoose from "mongoose";

import Appointment from "../models/appointment.model.js";

export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({});
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    console.log("error in fetching appointments:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createAppointments = async (req, res) => {
  const appointment = req.body;

  if (!appointment.firstName || !appointment.lastName) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }

  const newAppointment = new Appointment(appointment);

  try {
    await newAppointment.save();
    res.status(201).json({ success: true, data: newAppointment });
  } catch (error) {
    console.error("Error in creating appointment:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

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
    res.status(404).json({ success: false, message: "Appointment not found" });
  }
};

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
