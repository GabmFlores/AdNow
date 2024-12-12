import mongoose from "mongoose";

const columnSchema = new mongoose.Schema(
  {
    image: {
      type: String, // URL-based image
      required: true,
    },
    columnTitle: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      default: "", // Not required
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

const Column = mongoose.model("Column", columnSchema);

export default Column;
