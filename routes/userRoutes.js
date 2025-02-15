import express from "express";
import { getUsers, getUser } from "../controllers/userControllers.js";
const router = express.Router();

// Get all users
router.get("/", getUsers);

// Get single user
router.get("/:id", getUser);

export default router;
