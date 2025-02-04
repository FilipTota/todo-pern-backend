import express from "express";
import { getTodos } from "../controllers/todosContollers.js";
const router = express.Router();

router.get("/", getTodos);

export default router;
