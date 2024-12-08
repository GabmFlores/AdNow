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
    },
    idNum: {
      type: String,
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
    date: {
      type: Date,
      required: true,
    },
    concern: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
