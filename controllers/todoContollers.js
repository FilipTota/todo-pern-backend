import pool from "../database.js";
import jwt from "jsonwebtoken";
import { prisma } from "../server.js";

const getJwtToken = (req, res) => {
  // Extract the token from auth header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(400)
      .json({ message: "Authorization header is required" });
  }

  return authHeader.split(" ")[1];
};

const getUserId = (jwtToken) => {
  // Verify and decode jwt token
  const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
  return decoded.userId;
};

// @desc    Get all todos
// @route   GET /api/todos
export const getTodos = async (req, res) => {
  try {
    const jwtToken = getJwtToken(req, res);
    if (!jwtToken)
      return res.status(400).json({ message: "jwtToken is required" });

    const userId = getUserId(jwtToken);

    const todos = await prisma.todo.findMany({
      where: { user_id: userId }, // Filter todos by userId
    });
    if (!todos || todos.length === 0) {
      return res.status(404).json({ message: "No todos found" });
    }
    res.json(todos);
  } catch (error) {
    console.error("Error when getting todos:", error);
    res.status(500).json({
      message: "An error occurred while getting the todos.",
      error: error.message,
    });
  }
};

// @desc    Get single todo
// @route   GET /api/todos/:id
export const getTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM todo WHERE id=$1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Error when getting single todo:", error);
    res.status(500).json({
      message: "An error occurred while getting the todo.",
      error: error.message,
    });
  }
};

// @desc    Create new todo
// @route   POST /api/todos
export const createTodo = async (req, res) => {
  try {
    const jwtToken = getJwtToken(req, res);
    if (!jwtToken)
      return res.status(400).json({ message: "jwtToken is required" });

    const { description } = req.body;
    const userId = getUserId(jwtToken);

    // Validate input
    if (!description || description.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "Description is required and cannot be empty." });
    }

    const { rows } = await pool.query(
      `INSERT INTO todo(description, user_id) VALUES($1, $2) RETURNING *`,
      [description, userId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({
      message: "An error occurred while creating the todo.",
      error: error.message,
    });
  }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    // Validate input
    if (!description || description.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "Description is required and cannot be empty." });
    }

    const todo = await pool.query("SELECT * FROM todo WHERE id=$1", [id]);
    if (todo.rows.length === 0) {
      return res.status(404).json({
        message: `Todo with id ${id} not found`,
      });
    }

    const { rows } = await pool.query(
      "UPDATE todo SET description=$1 WHERE id=$2 RETURNING *",
      [description, id]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error when updating todo:", error);
    res.status(500).json({
      message: "An error occurred while updating the todo.",
      error: error.message,
    });
  }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM todo WHERE id=$1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({
        message: `Todo with id ${id} not found`,
      });
    }
    await pool.query("DELETE FROM todo WHERE id=$1", [id]);
    res.json({
      message: "Deleted sucessfully",
    });
  } catch (error) {
    console.error("Error when deleting todo:", error);
    res.status(500).json({
      message: "An error occurred while deleting the todo.",
      error: error.message,
    });
  }
};
