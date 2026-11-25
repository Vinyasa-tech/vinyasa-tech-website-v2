import { Router } from "express";

import {
  registerAdmin,
  loginAdmin,
  getCurrentAdmin,
} from "../controllers/authController";

// import { protect } from "../middleware/authMiddleware";

const router = Router();

/**
 * Register new admin
 * POST /api/auth/register
 */
router.post("/register", registerAdmin);

/**
 * Admin login
 * POST /api/auth/login
 */
router.post("/login", loginAdmin);

/**
 * Get currently logged-in admin
 * GET /api/auth/me
 */
// router.get("/me", protect, getCurrentAdmin);

export default router;