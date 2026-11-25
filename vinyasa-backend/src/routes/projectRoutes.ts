
import { Router } from "express";

import {
  getPublishedProjectsController,
  getAllProjectsController,
  getProjectController,
  createProjectController,
  updateProjectController,
  deleteProjectController,
  uploadProjectLogoController,
} from "../controllers/projectController";

import { protect } from "../middleware/authMiddleware";
import projectUpload from "../middleware/projectMulter";

const router = Router();

// =====================================
// PUBLIC ROUTES
// =====================================

// Get published projects
router.get(
  "/",
  getPublishedProjectsController
);

// =====================================
// ADMIN ROUTES
// =====================================

// IMPORTANT: Static routes must come before /:id

// Get all projects for admin panel
router.get(
  "/admin",
  protect,
  getAllProjectsController
);


// =====================================
// DYNAMIC PUBLIC ROUTE
// =====================================

// Get one project by ID
// Keep this route LAST
router.get(
  "/:id",
  getProjectController
);


// Upload project logo separately
router.post(
  "/upload-logo",
  protect,
  projectUpload.single("logo"),
  uploadProjectLogoController
);

// Create project
router.post(
  "/",
  protect,
  projectUpload.single("logo"),
  createProjectController
);

// Update project
router.put(
  "/:id",
  protect,
  projectUpload.single("logo"),
  updateProjectController
);

// Delete project
router.delete(
  "/:id",
  protect,
  deleteProjectController
);



export default router;
