import express from "express";
import usersRouter from "./routes/users.js";
import todosRouter from "./routes/todos.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
const PORT = 3000;

app.use(express.json());
app.use("/users", usersRouter);
app.use("/todos", todosRouter);

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);
});
