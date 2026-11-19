
import { Router } from "express";

import {
  getJobApplications,
  getJobApplication,
  getApplicationsForJob,
  createJobApplicationController,
  updateJobApplicationController,
  deleteJobApplicationController,
  getJobApplicationsByStatusController,
} from "../controllers/jobApplicationController";

import { protect } from "../middleware/authMiddleware";

const router = Router();

/* =====================================
   ADMIN ROUTES
===================================== */

// Get all applications
// GET /api/job-applications
router.get("/", protect, getJobApplications);

// Get applications by status
// GET /api/job-applications/status/:status
router.get(
  "/status/:status",
  protect,
  getJobApplicationsByStatusController
);

// Get applications for a specific job
// GET /api/job-applications/job/:jobId
router.get(
  "/job/:jobId",
  protect,
  getApplicationsForJob
);

// Update application status
// PUT /api/job-applications/:id
// Sends automatic status email after successful update
router.put(
  "/:id",
  protect,
  updateJobApplicationController
);

// Delete application
// DELETE /api/job-applications/:id
router.delete(
  "/:id",
  protect,
  deleteJobApplicationController
);

// Get a single application
// GET /api/job-applications/:id
router.get(
  "/:id",
  protect,
  getJobApplication
);

/* =====================================
   PUBLIC ROUTES
===================================== */

// Submit a job application
// POST /api/job-applications
router.post(
  "/",
  createJobApplicationController
);

export default router;
