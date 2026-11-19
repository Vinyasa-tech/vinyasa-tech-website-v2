
import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import {
  getAllProjects,
  getPublishedProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../models/projectModel";

// Get uploaded logo path
const getUploadedLogoPath = (req: Request): string | null => {
  return req.file
    ? `/uploads/projects/${req.file.filename}`
    : null;
};

// Delete uploaded logo from server
const deleteUploadedLogo = (
  logoPath: string | null | undefined
): void => {
  if (!logoPath?.startsWith("/uploads/projects/")) return;

  const filename = path.basename(logoPath);

  const fullPath = path.resolve(
    process.cwd(),
    "uploads",
    "projects",
    filename
  );

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

// Remove newly uploaded logo if request fails
const cleanupNewUpload = (req: Request): void => {
  if (req.file) {
    deleteUploadedLogo(
      `/uploads/projects/${req.file.filename}`
    );
  }
};

// POST: Upload project logo separately
export const uploadProjectLogoController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const logoPath = getUploadedLogoPath(req);

    if (!logoPath) {
      res.status(400).json({
        success: false,
        message: "Please select a project logo",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Project logo uploaded successfully",
      logo: logoPath,
    });
  } catch (error) {
    console.error("Upload project logo error:", error);

    cleanupNewUpload(req);

    res.status(500).json({
      success: false,
      message: "Failed to upload project logo",
    });
  }
};

// GET: Published projects for public website
export const getPublishedProjectsController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const projects = await getPublishedProjects();

    res.status(200).json({
      success: true,
      message: "Published projects fetched successfully",
      data: projects,
    });
  } catch (error) {
    console.error("Get published projects error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch published projects",
    });
  }
};

// GET: All projects for admin panel
export const getAllProjectsController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const projects = await getAllProjects();

    res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: projects,
    });
  } catch (error) {
    console.error("Get all projects error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};

// GET: One project by ID
export const getProjectController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
      return;
    }

    const project = await getProjectById(id);

    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Get project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
    });
  }
};

// POST: Create a project
export const createProjectController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      website,
      status,
    } = req.body;

    const logoPath = getUploadedLogoPath(req);

    if (
      typeof title !== "string" ||
      !title.trim() ||
      !logoPath ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      cleanupNewUpload(req);

      res.status(400).json({
        success: false,
        message: "Title, logo image, and description are required",
      });
      return;
    }

    if (
      status !== undefined &&
      status !== "published" &&
      status !== "draft"
    ) {
      cleanupNewUpload(req);

      res.status(400).json({
        success: false,
        message: "Status must be published or draft",
      });
      return;
    }

    if (
      website !== undefined &&
      website !== null &&
      typeof website !== "string"
    ) {
      cleanupNewUpload(req);

      res.status(400).json({
        success: false,
        message: "Website must be a valid string",
      });
      return;
    }

    const projectId = await createProject({
      title: title.trim(),
      logo: logoPath,
      description: description.trim(),
      website:
        typeof website === "string"
          ? website.trim() || null
          : null,
      status: status ?? "published",
    });

    const project = await getProjectById(projectId);

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error("Create project error:", error);

    cleanupNewUpload(req);

    res.status(500).json({
      success: false,
      message: "Failed to create project",
    });
  }
};

// PUT: Update a project
export const updateProjectController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      cleanupNewUpload(req);

      res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
      return;
    }

    const existingProject = await getProjectById(id);

    if (!existingProject) {
      cleanupNewUpload(req);

      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    const {
      title,
      description,
      website,
      status,
    } = req.body;

    if (
      title !== undefined &&
      (typeof title !== "string" || !title.trim())
    ) {
      cleanupNewUpload(req);

      res.status(400).json({
        success: false,
        message: "Title cannot be empty",
      });
      return;
    }

    if (
      description !== undefined &&
      (typeof description !== "string" || !description.trim())
    ) {
      cleanupNewUpload(req);

      res.status(400).json({
        success: false,
        message: "Description cannot be empty",
      });
      return;
    }

    if (
      status !== undefined &&
      status !== "published" &&
      status !== "draft"
    ) {
      cleanupNewUpload(req);

      res.status(400).json({
        success: false,
        message: "Status must be published or draft",
      });
      return;
    }

    if (
      website !== undefined &&
      website !== null &&
      typeof website !== "string"
    ) {
      cleanupNewUpload(req);

      res.status(400).json({
        success: false,
        message: "Website must be a valid string",
      });
      return;
    }

    const newLogoPath = getUploadedLogoPath(req);

    const updated = await updateProject(id, {
      ...(title !== undefined && {
        title: title.trim(),
      }),

      ...(newLogoPath && {
        logo: newLogoPath,
      }),

      ...(description !== undefined && {
        description: description.trim(),
      }),

      ...(website !== undefined && {
        website:
          typeof website === "string"
            ? website.trim() || null
            : null,
      }),

      ...(status !== undefined && { status }),
    });

    if (!updated) {
      cleanupNewUpload(req);

      res.status(400).json({
        success: false,
        message: "No project changes were made",
      });
      return;
    }

    // Delete old logo only after successful replacement
    if (newLogoPath && existingProject.logo) {
      deleteUploadedLogo(existingProject.logo);
    }

    const project = await getProjectById(id);

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    console.error("Update project error:", error);

    cleanupNewUpload(req);

    res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  }
};

// DELETE: Delete a project
export const deleteProjectController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
      return;
    }

    const existingProject = await getProjectById(id);

    if (!existingProject) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    const deleted = await deleteProject(id);

    if (!deleted) {
      res.status(400).json({
        success: false,
        message: "Failed to delete project",
      });
      return;
    }

    // Delete logo after successful database deletion
    deleteUploadedLogo(existingProject.logo);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
};
