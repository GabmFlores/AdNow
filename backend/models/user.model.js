import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    middleName: {
      type: String,
    },
    suffix: {
      type: String,
      default: "", // Optional field, can be empty
    },
    image: {
      type: String,
      default: "", // Optional field, can be empty (URL or base64 string for image)
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      select: false,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
