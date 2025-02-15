import express from "express";
import {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoContollers.js";
const router = express.Router();

// Get all todos
router.get("/", getTodos);

// Get single todo
router.get("/:id", getTodo);

// Create todo
router.post("/", createTodo);

// Update todo
router.put("/:id", updateTodo);

// Delete todo
router.delete("/:id", deleteTodo);

export default router;
