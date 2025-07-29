import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 5100;

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRouter);

app.use("/api/message", messageRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDB();
});
