import express from "express";
import {
  registerUser,
  loginUser,
  googleAuth,
  googleAuthCallback,
} from "../controllers/authControllers.js";
const router = express.Router();

// register user
router.post("/register", registerUser);

// login user
router.post("/login", loginUser);

// Route for Google OAuth authentication
router.get("/google", googleAuth);

// Google OAuth callback route
router.get("/google/callback", googleAuthCallback);

export default router;
