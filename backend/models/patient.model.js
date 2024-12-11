import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      default: "",
    },
    suffix: {
      type: String,
      default: "",
    },
    gbox: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    image: {
      type: String, // URL-based image
      default: "",
    },
    idNum: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
