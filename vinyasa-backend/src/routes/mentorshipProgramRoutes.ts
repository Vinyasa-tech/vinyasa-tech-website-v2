
import { Router } from "express";

import {
  getMentorshipPrograms,
  getMentorshipProgram,
  createMentorshipProgramController,
  updateMentorshipProgramController,
  deleteMentorshipProgramController,
  getMentorshipProgramsByStatusController,
} from "../controllers/mentorshipProgramController";

import { protect } from "../middleware/authMiddleware";

const router = Router();

/**
 * GET /api/mentorship-programs
 * Public: get all mentorship programs.
 */
router.get("/", getMentorshipPrograms);

/**
 * GET /api/mentorship-programs/status/:status
 * Public: filter programs by status.
 *
 * Supported: active, inactive, upcoming, completed
 */
router.get(
  "/status/:status",
  getMentorshipProgramsByStatusController
);

/**
 * GET /api/mentorship-programs/:id
 * Public: get one program.
 */
router.get("/:id", getMentorshipProgram);

/**
 * POST /api/mentorship-programs
 * Admin only: create a program.
 */
router.post(
  "/",
  protect,
  createMentorshipProgramController
);

/**
 * PUT /api/mentorship-programs/:id
 * Admin only: update a program.
 */
router.put(
  "/:id",
  protect,
  updateMentorshipProgramController
);

/**
 * DELETE /api/mentorship-programs/:id
 * Admin only: delete a program.
 */
router.delete(
  "/:id",
  protect,
  deleteMentorshipProgramController
);

export default router;
