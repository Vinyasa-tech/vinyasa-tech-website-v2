
import { Router } from "express";

import {
  getSuccessStories,
  getSuccessStory,
  createSuccessStoryController,
  updateSuccessStoryController,
  deleteSuccessStoryController,
  getPublishedStories,
  getSuccessStoriesByStatusController,
} from "../controllers/successStoryController";

import { protect } from "../middleware/authMiddleware";
import upload from "../middleware/multer";

const router = Router();

// Public routes
router.get("/", getSuccessStories);
router.get("/published", getPublishedStories);
router.get("/:id", getSuccessStory);

// Admin routes
router.get(
  "/status/:status",
  protect,
  getSuccessStoriesByStatusController
);

// Create success story
router.post(
  "/",
  protect,
  upload.single("image"),
  createSuccessStoryController
);

// Update success story
router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateSuccessStoryController
);

// Delete success story
router.delete(
  "/:id",
  protect,
  deleteSuccessStoryController
);

export default router;
