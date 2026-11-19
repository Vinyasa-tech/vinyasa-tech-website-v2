
import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import {
  getAllSuccessStories,
  getSuccessStoryById,
  createSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
  getPublishedSuccessStories,
  getSuccessStoriesByStatus,
} from "../models/successStoryModel";

type AdminRequest = Request & {
  adminId?: number;
};

const getAdminId = (req: Request): number | undefined => {
  return (req as AdminRequest).adminId;
};

const validStatus = (
  status: unknown
): status is "published" | "draft" => {
  return status === "published" || status === "draft";
};

// Get uploaded alumni image path
const getUploadedImagePath = (req: Request): string | null => {
  return req.file
    ? `/uploads/success-stories/${req.file.filename}`
    : null;
};

// Delete an uploaded image from the server
const deleteUploadedImage = (
  imagePath: string | null | undefined
): void => {
  if (!imagePath?.startsWith("/uploads/success-stories/")) return;

  const filename = path.basename(imagePath);

  const fullPath = path.resolve(
    process.cwd(),
    "uploads",
    "success-stories",
    filename
  );

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

// Clean up a newly uploaded image if the request fails
const cleanupNewUpload = (req: Request): void => {
  if (req.file) {
    deleteUploadedImage(
      `/uploads/success-stories/${req.file.filename}`
    );
  }
};

/**
 * GET /api/success-stories
 */
export const getSuccessStories = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const stories = await getAllSuccessStories();

    res.status(200).json({
      success: true,
      data: stories,
    });
  } catch (error) {
    console.error("Get success stories error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get success stories",
    });
  }
};

/**
 * GET /api/success-stories/:id
 */
export const getSuccessStory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid success story ID",
      });
      return;
    }

    const story = await getSuccessStoryById(id);

    if (!story) {
      res.status(404).json({
        success: false,
        message: "Success story not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: story,
    });
  } catch (error) {
    console.error("Get success story error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get success story",
    });
  }
};

/**
 * POST /api/success-stories
 */
export const createSuccessStoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      role,
      company,
      title,
      story,
      program,
      year,
      status,
    } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      cleanupNewUpload(req);

      res.status(400).json({
        success: false,
        message: "Name is required",
      });
      return;
    }

    if (typeof story !== "string" || !story.trim()) {
      cleanupNewUpload(req);

      res.status(400).json({
        success: false,
        message: "Story content is required",
      });
      return;
    }

    if (status !== undefined && !validStatus(status)) {
      cleanupNewUpload(req);

      res.status(400).json({
        success: false,
        message: "Status must be published or draft",
      });
      return;
    }

    if (program !== undefined && typeof program !== "string") {
      cleanupNewUpload(req);

      res.status(400).json({
        success: false,
        message: "Program must be text",
      });
      return;
    }

    if (
      year !== undefined &&
      year !== "" &&
      typeof year !== "string"
    ) {
      cleanupNewUpload(req);

      res.status(400).json({
        success: false,
        message: "Year must be text",
      });
      return;
    }

    const storyId = await createSuccessStory({
      name: name.trim(),

      role:
        typeof role === "string"
          ? role.trim() || null
          : null,

      company:
        typeof company === "string"
          ? company.trim() || null
          : null,

      title:
        typeof title === "string"
          ? title.trim() || null
          : null,

      story: story.trim(),

      program:
        typeof program === "string"
          ? program.trim() || null
          : null,

      year:
        typeof year === "string"
          ? year.trim() || null
          : null,

      image_url: getUploadedImagePath(req),
      status: status ?? "draft",
      created_by: getAdminId(req) ?? null,
    });

    const newStory = await getSuccessStoryById(storyId);

    res.status(201).json({
      success: true,
      message: "Success story created successfully",
      data: newStory,
    });
  } catch (error) {
    console.error("Create success story error:", error);

    cleanupNewUpload(req);

    res.status(500).json({
      success: false,
      message: "Failed to create success story",
    });
  }
};

/**
 * PUT /api/success-stories/:id
 */
export const updateSuccessStoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      cleanupNewUpload(req);

      res.status(400).json({
        success: false,
        message: "Invalid success story ID",
      });
      return;
    }

    const existingStory = await getSuccessStoryById(id);

    if (!existingStory) {
      cleanupNewUpload(req);

      res.status(404).json({
        success: false,
        message: "Success story not found",
      });
      return;
    }

    const {
      name,
      role,
      company,
      title,
      story,
      program,
      year,
      status,
    } = req.body;

    if (
      name !== undefined &&
      (typeof name !== "string" || !name.trim())
    ) {
      cleanupNewUpload(req);

      res.status(400).json({
        success: false,
        message: "Name cannot be empty",
      });
      return;
    }

    if (
      story !== undefined &&
      (typeof story !== "string" || !story.trim())
    ) {
      cleanupNewUpload(req);

      res.status(400).json({
        success: false,
        message: "Story content cannot be empty",
      });
      return;
    }

    if (status !== undefined && !validStatus(status)) {
      cleanupNewUpload(req);

      res.status(400).json({
        success: false,
        message: "Status must be published or draft",
      });
      return;
    }

    if (program !== undefined && typeof program !== "string") {
      cleanupNewUpload(req);

      res.status(400).json({
        success: false,
        message: "Program must be text",
      });
      return;
    }

    if (
      year !== undefined &&
      year !== "" &&
      typeof year !== "string"
    ) {
      cleanupNewUpload(req);

      res.status(400).json({
        success: false,
        message: "Year must be text",
      });
      return;
    }

    const newImagePath = getUploadedImagePath(req);

    const updated = await updateSuccessStory(id, {
      name:
        name !== undefined
          ? name.trim()
          : undefined,

      role:
        role !== undefined
          ? typeof role === "string"
            ? role.trim() || null
            : null
          : undefined,

      company:
        company !== undefined
          ? typeof company === "string"
            ? company.trim() || null
            : null
          : undefined,

      title:
        title !== undefined
          ? typeof title === "string"
            ? title.trim() || null
            : null
          : undefined,

      story:
        story !== undefined
          ? story.trim()
          : undefined,

      program:
        program !== undefined
          ? program.trim() || null
          : undefined,

      year:
        year !== undefined
          ? year.trim() || null
          : undefined,

      image_url: newImagePath ?? undefined,
      status,
    });

    if (!updated) {
      cleanupNewUpload(req);

      res.status(400).json({
        success: false,
        message: "No changes were submitted",
      });
      return;
    }

    // Delete previous image only after successful update
    if (newImagePath && existingStory.image_url) {
      deleteUploadedImage(existingStory.image_url);
    }

    const updatedStory = await getSuccessStoryById(id);

    res.status(200).json({
      success: true,
      message: "Success story updated successfully",
      data: updatedStory,
    });
  } catch (error) {
    console.error("Update success story error:", error);

    cleanupNewUpload(req);

    res.status(500).json({
      success: false,
      message: "Failed to update success story",
    });
  }
};

/**
 * DELETE /api/success-stories/:id
 */
export const deleteSuccessStoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid success story ID",
      });
      return;
    }

    const existingStory = await getSuccessStoryById(id);

    if (!existingStory) {
      res.status(404).json({
        success: false,
        message: "Success story not found",
      });
      return;
    }

    await deleteSuccessStory(id);

    // Delete alumni image from uploads folder
    deleteUploadedImage(existingStory.image_url);

    res.status(200).json({
      success: true,
      message: "Success story deleted successfully",
    });
  } catch (error) {
    console.error("Delete success story error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete success story",
    });
  }
};

/**
 * GET /api/success-stories/published
 */
export const getPublishedStories = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const stories = await getPublishedSuccessStories();

    res.status(200).json({
      success: true,
      data: stories,
    });
  } catch (error) {
    console.error("Get published stories error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get published success stories",
    });
  }
};

/**
 * GET /api/success-stories/status/:status
 */
export const getSuccessStoriesByStatusController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const status = req.params.status;

    if (!validStatus(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid status. Use published or draft",
      });
      return;
    }

    const stories = await getSuccessStoriesByStatus(status);

    res.status(200).json({
      success: true,
      data: stories,
    });
  } catch (error) {
    console.error("Get success stories by status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get success stories",
    });
  }
};
