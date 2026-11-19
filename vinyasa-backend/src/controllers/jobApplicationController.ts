
import { Request, Response } from "express";

import {
  getAllJobApplications,
  getJobApplicationById,
  getApplicationsByJobId,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
  getJobApplicationsByStatus,
  hasCandidateApplied,
  type Qualification,
  type ApplicationStatus,
} from "../models/jobApplicationModel";

import { getJobOpeningById } from "../models/jobOpeningModel";
import { sendCareerApplicationStatusEmail } from "../utils/careerApplicationEmail";

const validStatuses: ApplicationStatus[] = [
  "new",
  "reviewing",
  "shortlisted",
  "rejected",
  "hired",
];

/**
 * GET /api/job-applications
 * Get all applications.
 */
export const getJobApplications = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const applications = await getAllJobApplications();

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Get job applications error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get job applications",
    });
  }
};

/**
 * GET /api/job-applications/:id
 * Get one application.
 */
export const getJobApplication = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
      return;
    }

    const application = await getJobApplicationById(id);

    if (!application) {
      res.status(404).json({
        success: false,
        message: "Job application not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("Get job application error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get job application",
    });
  }
};

/**
 * GET /api/job-applications/job/:jobId
 * Get applications for one job.
 */
export const getApplicationsForJob = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const jobId = Number(req.params.jobId);

    if (!Number.isInteger(jobId) || jobId <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
      return;
    }

    const job = await getJobOpeningById(jobId);

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job opening not found",
      });
      return;
    }

    const applications = await getApplicationsByJobId(jobId);

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Get applications for job error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get applications for this job",
    });
  }
};

/**
 * POST /api/job-applications
 * Submit a new application.
 */
export const createJobApplicationController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      job_id,
      first_name,
      last_name,
      email,
      phone,
      experience,
      qualifications,
      technical_skills,
    } = req.body;

    // Validate required fields.
    if (
      job_id === undefined ||
      job_id === null ||
      String(job_id).trim() === "" ||
      typeof first_name !== "string" ||
      !first_name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof phone !== "string" ||
      !phone.trim() ||
      !Array.isArray(qualifications) ||
      qualifications.length === 0 ||
      !Array.isArray(technical_skills) ||
      technical_skills.length === 0
    ) {
      res.status(400).json({
        success: false,
        message:
          "Job, first name, email, phone, qualifications and technical skills are required.",
      });
      return;
    }

    const jobId = Number(job_id);

    if (!Number.isInteger(jobId) || jobId <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
      return;
    }

    // Validate optional last name.
    if (
      last_name !== undefined &&
      last_name !== null &&
      typeof last_name !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid last name",
      });
      return;
    }

    // Validate email.
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
      return;
    }

    // Validate phone number.
    const normalizedPhone = phone.trim();

    if (!/^\d{10}$/.test(normalizedPhone)) {
      res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number",
      });
      return;
    }

    // Validate experience.
    if (
      experience !== undefined &&
      experience !== null &&
      typeof experience !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid experience value",
      });
      return;
    }

    // Validate qualifications.
    if (qualifications.length > 10) {
      res.status(400).json({
        success: false,
        message: "You can add up to 10 qualifications",
      });
      return;
    }

    const validQualifications: Qualification[] = [];

    for (const item of qualifications) {
      if (
        !item ||
        typeof item.course !== "string" ||
        typeof item.collegeName !== "string" ||
        (typeof item.year !== "string" &&
          typeof item.year !== "number")
      ) {
        res.status(400).json({
          success: false,
          message:
            "Each qualification must include course, college name and completion year",
        });
        return;
      }

      const course = item.course.trim();
      const collegeName = item.collegeName.trim();
      const year = String(item.year).trim();
      const completionYear = Number(year);
      const currentYear = new Date().getFullYear();

      if (
        course.length < 2 ||
        course.length > 100 ||
        collegeName.length < 2 ||
        collegeName.length > 150 ||
        !/^\d{4}$/.test(year) ||
        completionYear < 1950 ||
        completionYear > currentYear + 10
      ) {
        res.status(400).json({
          success: false,
          message: "Please check your qualification details",
        });
        return;
      }

      validQualifications.push({
        course,
        collegeName,
        year,
      });
    }

    // Validate technical skills.
    const validSkills: string[] = [];
    const seenSkills = new Set<string>();

    for (const skill of technical_skills) {
      if (typeof skill !== "string") {
        res.status(400).json({
          success: false,
          message: "Technical skills must be text values",
        });
        return;
      }

      const trimmedSkill = skill.trim();

      if (trimmedSkill.length < 2 || trimmedSkill.length > 40) {
        res.status(400).json({
          success: false,
          message:
            "Each technical skill must contain 2–40 characters",
        });
        return;
      }

      const normalizedSkill = trimmedSkill.toLowerCase();

      if (seenSkills.has(normalizedSkill)) {
        res.status(400).json({
          success: false,
          message: "Duplicate technical skills are not allowed",
        });
        return;
      }

      seenSkills.add(normalizedSkill);
      validSkills.push(trimmedSkill);
    }

    if (validSkills.length > 20) {
      res.status(400).json({
        success: false,
        message: "You can enter up to 20 technical skills",
      });
      return;
    }

    // Check whether the job exists.
    const job = await getJobOpeningById(jobId);

    if (!job) {
      res.status(404).json({
        success: false,
        message: "Job opening not found",
      });
      return;
    }

    // Only open jobs can receive applications.
    if (job.status !== "open") {
      res.status(400).json({
        success: false,
        message: "Applications are not currently open for this job",
      });
      return;
    }

    // Prevent duplicate applications.
    const alreadyApplied = await hasCandidateApplied(
      jobId,
      normalizedEmail
    );

    if (alreadyApplied) {
      res.status(409).json({
        success: false,
        message: "You have already applied for this position",
      });
      return;
    }

    // Save the application in MySQL.
    const applicationId = await createJobApplication({
      job_id: jobId,
      first_name: first_name.trim(),
      last_name:
        typeof last_name === "string"
          ? last_name.trim()
          : undefined,
      email: normalizedEmail,
      phone: normalizedPhone,
      experience:
        typeof experience === "string"
          ? experience.trim()
          : undefined,
      qualifications: validQualifications,
      technical_skills: validSkills,
    });

    const application = await getJobApplicationById(applicationId);

    res.status(201).json({
      success: true,
      message: "Job application submitted successfully",
      data: application,
    });
  } catch (error) {
    console.error("Create job application error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit job application",
    });
  }
};

/**
 * PUT /api/job-applications/:id
 * Update application status and send status email.
 */
export const updateJobApplicationController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
      return;
    }

    const existingApplication = await getJobApplicationById(id);

    if (!existingApplication) {
      res.status(404).json({
        success: false,
        message: "Job application not found",
      });
      return;
    }

    const { status } = req.body;

    if (
      typeof status !== "string" ||
      !validStatuses.includes(status as ApplicationStatus)
    ) {
      res.status(400).json({
        success: false,
        message:
          "Invalid status. Use new, reviewing, shortlisted, rejected or hired",
      });
      return;
    }

    const newStatus = status as ApplicationStatus;
    const previousStatus = existingApplication.status;

    // Do not send another email if status is unchanged.
    if (previousStatus === newStatus) {
      res.status(200).json({
        success: true,
        message: "Application status is already up to date",
        data: existingApplication,
        emailSent: false,
      });
      return;
    }

    // Update the database first.
    const updated = await updateJobApplication(id, {
      status: newStatus,
    });

    if (!updated) {
      res.status(400).json({
        success: false,
        message: "No changes were made",
      });
      return;
    }

    const updatedApplication = await getJobApplicationById(id);

    if (!updatedApplication) {
      res.status(500).json({
        success: false,
        message:
          "Application was updated, but could not be retrieved",
      });
      return;
    }

    let emailSent = false;
    let emailError: string | undefined;

    // Send email for changed statuses except "new".
    if (newStatus !== "new") {
      try {
        await sendCareerApplicationStatusEmail(
          updatedApplication,
          newStatus
        );

        emailSent = true;

        console.log(
          `Career status email sent to ${updatedApplication.email} for status: ${newStatus}`
        );
      } catch (error) {
        emailError =
          error instanceof Error
            ? error.message
            : "Unknown email sending error";

        console.error(
          "Career application status email error:",
          error
        );
      }
    }

    res.status(200).json({
      success: true,
      message: emailSent
        ? `Application status updated to ${newStatus} and email sent successfully`
        : newStatus === "new"
          ? "Application status updated successfully"
          : "Application status updated, but the email could not be sent",

      data: updatedApplication,
      emailSent,
      ...(emailError ? { emailError } : {}),
    });
  } catch (error) {
    console.error("Update job application error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update job application",
    });
  }
};

/**
 * DELETE /api/job-applications/:id
 * Delete an application.
 */
export const deleteJobApplicationController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
      return;
    }

    const existingApplication = await getJobApplicationById(id);

    if (!existingApplication) {
      res.status(404).json({
        success: false,
        message: "Job application not found",
      });
      return;
    }

    await deleteJobApplication(id);

    res.status(200).json({
      success: true,
      message: "Job application deleted successfully",
    });
  } catch (error) {
    console.error("Delete job application error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete job application",
    });
  }
};

/**
 * GET /api/job-applications/status/:status
 * Get applications by status.
 */
export const getJobApplicationsByStatusController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const status = req.params.status as ApplicationStatus;

    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message:
          "Invalid status. Use new, reviewing, shortlisted, rejected or hired",
      });
      return;
    }

    const applications = await getJobApplicationsByStatus(status);

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Get applications by status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get applications",
    });
  }
};
