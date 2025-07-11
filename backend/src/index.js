import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import AuthRoute from "./routes/Auth.route.js";
import HostRoute from "./routes/Host.route.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// route setup
app.use("/api/auth", AuthRoute);
app.use("/api/host", HostRoute);

app.listen(PORT, () => {
  console.log("server is running in port : " + PORT);
  connectDB();
});
