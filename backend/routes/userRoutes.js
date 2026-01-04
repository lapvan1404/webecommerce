// backend/routes/userRoutes.js
import express from "express";
import {
  authUser,
  registerUser,
} from "../controllers/userController.js";

const router = express.Router();

// POST /api/users/login
router.post("/login", authUser);

// POST /api/users/register
router.post("/register", registerUser);

export default router;
