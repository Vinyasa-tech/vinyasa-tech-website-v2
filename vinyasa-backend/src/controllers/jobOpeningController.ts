
import { Request, Response } from "express";
import {
  getAllJobOpenings,
  getJobOpeningById,
  createJobOpening,
  updateJobOpening,
  deleteJobOpening,
  getJobOpeningsByStatus,
  type CreateJobOpeningData,
  type JobStatus,
  type WorkMode,
  type EmploymentType,
} from "../models/jobOpeningModel";

const toText = (value: unknown): string | null | undefined => {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean)
      .join("\n");
  }

  if (typeof value === "string") return value.trim() || null;

  return undefined;
};

const validStatuses: JobStatus[] = ["open", "closed", "draft"];
const validWorkModes: WorkMode[] = ["On-site", "Hybrid", "Remote"];
const validEmploymentTypes: EmploymentType[] = [
  "Full Time",
  "Part Time",
  "Contract",
  "Internship",
];

export const getJobs = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const jobs = await getAllJobOpenings();
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get job openings",
    });
  }
};

export const getJob = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ success: false, message: "Invalid job ID" });
      return;
    }

    const job = await getJobOpeningById(id);

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job opening not found",
      });
      return;
    }

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    console.error("Get job error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get job opening",
    });
  }
};

export const createJob = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const body = req.body;

    if (typeof body.title !== "string" || !body.title.trim()) {
      res.status(400).json({
        success: false,
        message: "Job title is required",
      });
      return;
    }

    if (
      body.work_mode !== undefined &&
      !validWorkModes.includes(body.work_mode)
    ) {
      res.status(400).json({
        success: false,
        message: "Work mode must be On-site, Hybrid or Remote",
      });
      return;
    }

    if (
      body.employment_type !== undefined &&
      !validEmploymentTypes.includes(body.employment_type)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid employment type",
      });
      return;
    }

    if (
      body.status !== undefined &&
      !validStatuses.includes(body.status)
    ) {
      res.status(400).json({
        success: false,
        message: "Status must be open, closed or draft",
      });
      return;
    }

    const adminId = (
      req as Request & { adminId?: number }
    ).adminId;

    const data: CreateJobOpeningData = {
      title: body.title.trim(),
      department: body.department,
      location: body.location,
      employment_type: body.employment_type,
      work_mode: body.work_mode,
      description: toText(body.description),
      responsibilities: toText(body.responsibilities),
      required_skills: toText(body.required_skills),
      qualifications: toText(body.qualifications),
      experience: body.experience,
      status: body.status ?? "open",
      application_deadline: body.application_deadline || null,
      created_by: adminId,
    };

    const jobId = await createJobOpening(data);
    const newJob = await getJobOpeningById(jobId);

    res.status(201).json({
      success: true,
      message: "Job opening created successfully",
      data: newJob,
    });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create job opening",
    });
  }
};

export const updateJob = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ success: false, message: "Invalid job ID" });
      return;
    }

    const existingJob = await getJobOpeningById(id);

    if (!existingJob) {
      res.status(404).json({
        success: false,
        message: "Job opening not found",
      });
      return;
    }

    const body = req.body;

    if (
      body.title !== undefined &&
      (typeof body.title !== "string" || !body.title.trim())
    ) {
      res.status(400).json({
        success: false,
        message: "Job title cannot be empty",
      });
      return;
    }

    if (
      body.work_mode !== undefined &&
      !validWorkModes.includes(body.work_mode)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid work mode",
      });
      return;
    }

    if (
      body.employment_type !== undefined &&
      !validEmploymentTypes.includes(body.employment_type)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid employment type",
      });
      return;
    }

    if (
      body.status !== undefined &&
      !validStatuses.includes(body.status)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid job status",
      });
      return;
    }

    const data = {
      title:
        body.title !== undefined ? body.title.trim() : undefined,
      department: body.department,
      location: body.location,
      employment_type: body.employment_type,
      work_mode: body.work_mode,
      description: toText(body.description),
      responsibilities: toText(body.responsibilities),
      required_skills: toText(body.required_skills),
      qualifications: toText(body.qualifications),
      experience: body.experience,
      status: body.status,
      application_deadline:
        body.application_deadline === ""
          ? null
          : body.application_deadline,
    };

    const updated = await updateJobOpening(id, data);

    if (!updated) {
      res.status(400).json({
        success: false,
        message: "No changes were made",
      });
      return;
    }

    const updatedJob = await getJobOpeningById(id);

    res.status(200).json({
      success: true,
      message: "Job opening updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update job opening",
    });
  }
};

export const deleteJob = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ success: false, message: "Invalid job ID" });
      return;
    }

    const existingJob = await getJobOpeningById(id);

    if (!existingJob) {
      res.status(404).json({
        success: false,
        message: "Job opening not found",
      });
      return;
    }

    await deleteJobOpening(id);

    res.status(200).json({
      success: true,
      message: "Job opening deleted successfully",
    });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete job opening",
    });
  }
};

export const getJobsByStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const status = req.params.status as JobStatus;

    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid status. Use open, closed or draft",
      });
      return;
    }

    const jobs = await getJobOpeningsByStatus(status);
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("Get jobs by status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get jobs",
    });
  }
};
