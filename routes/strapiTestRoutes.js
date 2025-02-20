import express from "express";
import { getTests, createTest } from "../controllers/strapiTestControllers.js";
const router = express.Router();

// Get all tests
router.get("/", getTests);

// Create test
router.post("/", createTest);

export default router;
