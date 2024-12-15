import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    lastName: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
    },
    gboxAcc: {
      type: String,
      required: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@gbox\.adnu\.edu\.ph$/,
        "Please provide a valid Gbox email address with @gbox.adnu.edu.ph domain",
      ], // Email validation for @gbox.adnu.edu.ph
    },
    idNum: {
      type: Number,
      required: true,
    },
    sex: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: false,
    },
    course: {
      type: String,
      required: false,
    },
    desiredDate: {
      type: Date,
      required: true, // This is the original date requested by the patient
    },
    scheduledDate: {
      type: Date,
      default: "", // Optional; only set if the appointment is approved and rescheduled
    },
    concern: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Unscheduled"], // Only these two statuses
      default: "Unscheduled", // Default value for new appointments
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
