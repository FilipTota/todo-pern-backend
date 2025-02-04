import express from "express";
import todos from "./routes/todos.js";
const port = process.env.PORT || 3001;

const app = express();

// ROUTES
app.use("/api/todos", todos);

app.listen(port, () => console.log(`Server started on port ${port}`));
