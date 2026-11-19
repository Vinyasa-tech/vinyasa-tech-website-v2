import { Router } from "express";
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getJobsByStatus,
} from "../controllers/jobOpeningController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getJobs);
router.get("/status/:status", getJobsByStatus);
router.get("/:id", getJob);

router.post("/", protect, createJob);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

export default router;