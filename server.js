import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";

import "./middleware/googleAuth.js";

import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import strapiTestRoutes from "./routes/strapiTestRoutes.js";
import { checkStrapiAccess } from "./middleware/checkStrapiAccess.js";

import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

const port = process.env.PORT || 3001;

const app = express();
// Middleware to initialize Passport
app.use(
  session({
    secret: process.env.JWT_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

// Strapi test
app.use("/api/tests", checkStrapiAccess, strapiTestRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));
