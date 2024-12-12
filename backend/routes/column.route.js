import express from "express";
import {
  getColumns,
  createColumn,
  deleteColumn,
  updateColumn,
} from "../controllers/column.controller.js";

const router = express.Router();

// Get all columns
router.get("/", getColumns);

// Create a new column
router.post("/", createColumn);

// Delete a column by ID
router.delete("/:id", deleteColumn);

// Update column details by ID
router.patch("/:id", updateColumn);

export default router;
