import mongoose from "mongoose";
import Patient from "../models/patient.model.js";

// Fetch all patients
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({});
    res.status(200).json({ success: true, data: patients });
  } catch (error) {
    console.error("Error fetching patients:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Create a new patient
export const createPatient = async (req, res) => {
  const {
    firstName,
    lastName,
    middleName,
    suffix,
    gbox,
    address,
    department,
    course,
    image,
  } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !gbox || !address || !department || !course) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all required fields" });
  }

  const newPatient = new Patient({
    firstName,
    lastName,
    middleName: middleName || "",
    suffix: suffix || "",
    gbox,
    address,
    department,
    course,
    image: image || "",
  });

  try {
    await newPatient.save();
    res.status(201).json({ success: true, data: newPatient });
  } catch (error) {
    console.error("Error creating patient:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete a patient by ID
export const deletePatient = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Patient Not Found" });
  }

  try {
    await Patient.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Patient Deleted" });
  } catch (error) {
    console.error("Error deleting patient:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update patient details
export const updatePatient = async (req, res) => {
  const { id } = req.params;
  const patientData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Patient Not Found" });
  }

  try {
    const updatedPatient = await Patient.findByIdAndUpdate(id, patientData, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedPatient });
  } catch (error) {
    console.error("Error updating patient:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
