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
      match: /^[a-zA-Z0-9._%+-]+@gbox\.adnu\.edu\.ph$/, // Regular expression to match gbox email
      message: "Please enter a valid gbox email address (@gbox.adnu.edu.ph)",
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
      type: Number,
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
