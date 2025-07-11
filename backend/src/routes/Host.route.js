import express from "express";
import {
  LoginHost,
  LogoutHost,
  RegisterHost,
} from "../controllers/Host.controller.js";
import { authenticate } from "../middleware/authenticate.js";
import upload from "../middleware/multer.js";


const HostRoute = express.Router();

HostRoute.post(
  "/register",
  upload.fields([
    { name: "idProofImage", maxCount: 1 },
    { name: "homestayImages", maxCount: 5 }
  ]),
  RegisterHost
);

HostRoute.post("/login", LoginHost);

HostRoute.get("/logout", authenticate, LogoutHost);

export default HostRoute;