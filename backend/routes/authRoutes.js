import express from "express";
import { register, login, getProfile } from '../controllers/authController.js';
import auth from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/me", auth, getProfile);
router.post('/register', register);
router.post('/login', login);

export default router;