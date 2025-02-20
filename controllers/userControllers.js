import pool from "../database.js";
import { prisma } from "../server.js";

// @desc    Get all users
// @route   GET /api/users
export const getUsers = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM "user"');
    if (!rows) {
      return res.status(404).json({ message: "No users found" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Error when getting users:", error);
    res.status(500).json({
      message: "An error occurred while getting the users.",
      error: error.message,
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findFirst({
      where: {
        user_id: Number(id),
      },
      include: {
        todo: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error when getting single user:", error);
    res.status(500).json({
      message: "An error occurred while getting the user.",
      error: error.message,
    });
  }
};
