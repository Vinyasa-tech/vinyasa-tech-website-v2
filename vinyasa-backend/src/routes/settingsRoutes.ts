
import { Router } from "express";

import {
  getAdminSettings,
  updateAdminSettings,
  updateAdminProfile,
  changeAdminPassword,
} from "../controllers/settingsController";

import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getAdminSettings);

router.put("/", protect, updateAdminSettings);

router.put("/profile", protect, updateAdminProfile);

router.put("/password", protect, changeAdminPassword);

export default router;
