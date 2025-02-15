import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import userRoutes from "./routes/userRoutes.js";
const port = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(cors());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));
