import mongoose from "mongoose";
import Column from "../models/column.model.js";

// Fetch all columns
export const getColumns = async (req, res) => {
  try {
    const columns = await Column.find({});
    res.status(200).json({ success: true, data: columns });
  } catch (error) {
    console.error("Error fetching columns:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Create a new column
export const createColumn = async (req, res) => {
  const { image, columnTitle, author, content } = req.body;

  // Validate required fields
  if (!image || !columnTitle || !content) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all required fields" });
  }

  const newColumn = new Column({
    image,
    columnTitle,
    author: author || "",
    content,
  });

  try {
    await newColumn.save();
    res.status(201).json({ success: true, data: newColumn });
  } catch (error) {
    console.error("Error creating column:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete a column by ID
export const deleteColumn = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Column Not Found" });
  }

  try {
    await Column.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Column Deleted" });
  } catch (error) {
    console.error("Error deleting column:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update column details
export const updateColumn = async (req, res) => {
  const { id } = req.params;
  const columnData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Column Not Found" });
  }

  try {
    const updatedColumn = await Column.findByIdAndUpdate(id, columnData, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedColumn });
  } catch (error) {
    console.error("Error updating column:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
