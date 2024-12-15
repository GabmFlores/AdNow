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
      default: "",
    },
    suffix: {
      type: String,
      enum: ["", "Jr.", "Sr.", "II", "III"], // Example suffix options
      default: "",
    },
    image: {
      type: String,
      default: "https://www.example.com/default-avatar.jpg", // Default image URL
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username can't be longer than 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true, // Convert to lowercase
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"], // Validate email format
      select: false,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minlength: [6, "Password must be at least 6 characters long"],
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Indexing username and email for better query performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);

export default User;
