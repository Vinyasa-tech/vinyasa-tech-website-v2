
import { Router } from "express";

import {
  getMentorshipApplications,
  getMentorshipApplication,
  getApplicationsForProgram,
  createMentorshipApplicationController,
  updateMentorshipApplicationController,
  deleteMentorshipApplicationController,
  getMentorshipApplicationsByStatusController,
} from "../controllers/mentorshipApplicationController";

import { protect } from "../middleware/authMiddleware";

const router = Router();

/**
 * Get all mentorship applications
 * GET /api/mentorship-applications
 * Admin only
 */
router.get("/", protect, getMentorshipApplications);

/**
 * Get applications by status
 * GET /api/mentorship-applications/status/:status
 * Admin only
 */
router.get(
  "/status/:status",
  protect,
  getMentorshipApplicationsByStatusController
);

/**
 * Get applications for a particular program
 * GET /api/mentorship-applications/program/:programId
 * Admin only
 */
router.get(
  "/program/:programId",
  protect,
  getApplicationsForProgram
);

/**
 * Submit a mentorship application
 * POST /api/mentorship-applications
 * Public
 */
router.post(
  "/",
  createMentorshipApplicationController
);

/**
 * Get one mentorship application
 * GET /api/mentorship-applications/:id
 * Admin only
 */
router.get(
  "/:id",
  protect,
  getMentorshipApplication
);

/**
 * Update a mentorship application
 * PUT /api/mentorship-applications/:id
 * Admin only
 */
router.put(
  "/:id",
  protect,
  updateMentorshipApplicationController
);

/**
 * Delete a mentorship application
 * DELETE /api/mentorship-applications/:id
 * Admin only
 */
router.delete(
  "/:id",
  protect,
  deleteMentorshipApplicationController
);

export default router;
