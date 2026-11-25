
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

// Get applications belonging to the logged-in candidate
router.get(
  "/applications/me",
  protectCandidate,
  getMyCandidateApplications
);

// Candidate registration
router.post("/register", registerCandidate);

// Candidate login
router.post("/login", loginCandidate);


export default router;
