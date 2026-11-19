
import { Router } from "express";

import {
  registerCandidate,
  loginCandidate,
  getMyCandidateApplications,
} from "../controllers/candidateAuthController";

import {
  protectCandidate,
} from "../middleware/candidateAuthMiddleware";

const router = Router();

// Candidate registration
router.post("/register", registerCandidate);

// Candidate login
router.post("/login", loginCandidate);

// Get applications belonging to the logged-in candidate
router.get(
  "/applications/me",
  protectCandidate,
  getMyCandidateApplications
);

export default router;
