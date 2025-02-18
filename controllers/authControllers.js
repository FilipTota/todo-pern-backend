import pool from "../database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import "../middleware/googleAuth.js";

const generateUserToken = async (userId) => {
  const accessToken = await jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
  return accessToken;
};

// @desc    Register user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields are required." });

  try {
    // check if user already exists
    const { rows } = await pool.query('SELECT * FROM "user" WHERE email = $1', [
      email,
    ]);
    if (rows.length)
      return res.status(400).json({ message: "Email already in use." });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user into the database
    const {
      rows: [newUser],
    } = await pool.query(
      'INSERT INTO "user" (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    // generate JWT for new user (so that user logs in in on register)
    const token = await generateUserToken(newUser.user_id);

    return res.status(201).json({
      message: "Registered successfully",
      accessToken: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error.", message: error });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "All fields are required." });

  try {
    // check if user exists
    const { rows } = await pool.query('SELECT * FROM "user" WHERE email = $1', [
      email,
    ]);
    if (!rows.length || !(await bcrypt.compare(password, rows[0].password)))
      return res.status(400).json({ message: `Wrong credentials` });

    // generate JWT
    const token = await generateUserToken(rows[0].user_id);

    return res
      .status(201)
      .json({ message: "Login successful", accessToken: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error.", message: error });
  }
};

// @desc    auth user with google
// @route   GET /api/auth/google
export const googleAuth = (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next); // Ensure you call this as middleware
};

// @desc    google auth callback
// @route   GET /api/auth/google/callback
export const googleAuthCallback = (req, res) => {
  passport.authenticate("google", { failureRedirect: "/todo" }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Authentication failed" });
    }

    // Successful authentication
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Login failed" });
      }

      // Redirect or send user data back to the frontend
      return res.json(user); // Here you can send the authenticated user or any necessary data back
    });
  })(req, res);
};
