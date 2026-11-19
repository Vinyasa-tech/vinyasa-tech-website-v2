
import { Request, Response } from "express";

import {
  getAllMentorshipApplications,
  getMentorshipApplicationById,
  getApplicationsByProgramId,
  createMentorshipApplication,
  updateMentorshipApplication,
  deleteMentorshipApplication,
  getMentorshipApplicationsByStatus,
} from "../models/mentorshipApplicationModel";

import {
  getMentorshipProgramById,
  incrementEnrolledCount,
  decrementEnrolledCount,
  getAllMentorshipPrograms,
} from "../models/mentorshipProgramModel";

import { sendMentorshipStatusEmail } from "../utils/mentorshipStatusEmail";

type ApplicationStatus = "pending" | "approved" | "rejected";

const validStatuses: ApplicationStatus[] = [
  "pending",
  "approved",
  "rejected",
];

const validProgramPreferences = [
  "Internship Only",
  "Course + Internship",
] as const;

type ProgramPreference =
  (typeof validProgramPreferences)[number];

// Type guard: validates the preference and narrows its TypeScript type.
const isValidProgramPreference = (
  value: string
): value is ProgramPreference => {
  return validProgramPreferences.some(
    (preference) => preference === value
  );
};

/**
 * GET /api/mentorship-applications
 */
export const getMentorshipApplications = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const applications = await getAllMentorshipApplications();

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Get mentorship applications error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get mentorship applications",
    });
  }
};

/**
 * GET /api/mentorship-applications/:id
 */
export const getMentorshipApplication = async (
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

    const application = await getMentorshipApplicationById(id);

    if (!application) {
      res.status(404).json({
        success: false,
        message: "Mentorship application not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("Get mentorship application error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get mentorship application",
    });
  }
};

/**
 * GET /api/mentorship-applications/program/:programId
 */
export const getApplicationsForProgram = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const programId = Number(req.params.programId);

    if (!Number.isInteger(programId) || programId <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid program ID",
      });
      return;
    }

    const program = await getMentorshipProgramById(programId);

    if (!program) {
      res.status(404).json({
        success: false,
        message: "Mentorship program not found",
      });
      return;
    }

    const applications = await getApplicationsByProgramId(programId);

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Get program applications error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get program applications",
    });
  }
};

/**
 * POST /api/mentorship-applications
 *
 * New applications receive their default status from the database: pending.
 */
export const createMentorshipApplicationController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const body = req.body ?? {};

    const text = (value: unknown): string =>
      typeof value === "string" ? value.trim() : "";

    const fullName = text(body.fullName);
    const firstNameFromBody = text(body.first_name);
    const lastNameFromBody = text(body.last_name);

    const nameParts = fullName
      ? fullName.split(/\s+/)
      : [firstNameFromBody, lastNameFromBody].filter(Boolean);

    const firstName = fullName
      ? nameParts[0]
      : firstNameFromBody;

    const lastName = fullName
      ? nameParts.slice(1).join(" ")
      : lastNameFromBody;

    const email = text(body.email).toLowerCase();
    const phone = text(body.phone);
    const city = text(body.city);
    const college = text(body.college);
    const course = text(body.course);

    const graduationYearValue =
      body.graduationYear ?? body.graduation_year;

    const duration = text(body.duration);
    const goals = text(body.goals);

    const additionalMessage = text(
      body.additionalMessage ?? body.additional_message
    );

    const programPreference = text(body.program_preference);

    const education =
      text(body.education) ||
      [college, course].filter(Boolean).join(" - ");

    const programIdValue = body.program_id;
    const programTitle = text(body.program);

    // Required fields
    if (!firstName || !email || (!programIdValue && !programTitle)) {
      res.status(400).json({
        success: false,
        message: "Name, email and mentorship program are required",
      });
      return;
    }

    // Program preference validation
    if (!isValidProgramPreference(programPreference)) {
      res.status(400).json({
        success: false,
        message:
          "Please select a valid program preference: Internship Only or Course + Internship",
      });
      return;
    }

    // Name validation
    if (firstName.length > 100 || lastName.length > 100) {
      res.status(400).json({
        success: false,
        message: "Name must not exceed 100 characters per field",
      });
      return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email) || email.length > 150) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
      return;
    }

    // Phone validation
    if (phone && phone.length > 30) {
      res.status(400).json({
        success: false,
        message: "Phone number must not exceed 30 characters",
      });
      return;
    }

    // Graduation year validation
    let graduationYear: number | null = null;

    if (
      graduationYearValue !== undefined &&
      graduationYearValue !== null &&
      String(graduationYearValue).trim() !== ""
    ) {
      graduationYear = Number(graduationYearValue);

      if (
        !Number.isInteger(graduationYear) ||
        graduationYear < 1900 ||
        graduationYear > 2200
      ) {
        res.status(400).json({
          success: false,
          message: "Please provide a valid graduation year",
        });
        return;
      }
    }

    // Resolve mentorship program ID
    let programId: number;

    if (
      programIdValue !== undefined &&
      programIdValue !== null &&
      programIdValue !== ""
    ) {
      programId = Number(programIdValue);

      if (!Number.isInteger(programId) || programId <= 0) {
        res.status(400).json({
          success: false,
          message: "Invalid mentorship program ID",
        });
        return;
      }
    } else {
      const programs = await getAllMentorshipPrograms();

      const matchedProgram = programs.find(
        (item) =>
          item.title.trim().toLowerCase() ===
          programTitle.toLowerCase()
      );

      if (!matchedProgram) {
        res.status(404).json({
          success: false,
          message: "Selected mentorship program was not found",
        });
        return;
      }

      programId = matchedProgram.id;
    }

    // Check selected program
    const program = await getMentorshipProgramById(programId);

    if (!program) {
      res.status(404).json({
        success: false,
        message: "Mentorship program not found",
      });
      return;
    }

    if (
      program.status !== "active" &&
      program.status !== "upcoming"
    ) {
      res.status(400).json({
        success: false,
        message:
          "Applications are not currently open for this program",
      });
      return;
    }

    // Check program capacity
    if (
      program.capacity > 0 &&
      program.enrolled_count >= program.capacity
    ) {
      res.status(400).json({
        success: false,
        message: "This mentorship program is currently full",
      });
      return;
    }

    // Save application
    const applicationId = await createMentorshipApplication({
      program_id: programId,
      first_name: firstName,
      last_name: lastName || undefined,
      email,
      phone: phone || undefined,
      education: education || undefined,
      goals:
        [goals, additionalMessage]
          .filter(Boolean)
          .join("\n\n") || undefined,
      city: city || undefined,
      college: college || undefined,
      course: course || undefined,
      graduation_year: graduationYear ?? undefined,
      duration: duration || undefined,
      additional_message: additionalMessage || undefined,
      program_preference: programPreference,
    });

    const application =
      await getMentorshipApplicationById(applicationId);

    res.status(201).json({
      success: true,
      message: "Mentorship application submitted successfully",
      data: application,
    });
  } catch (error) {
    console.error("Create mentorship application error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit mentorship application",
    });
  }
};

/**
 * PUT /api/mentorship-applications/:id
 *
 * Update application status only.
 */
export const updateMentorshipApplicationController = async (
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

    const existingApplication =
      await getMentorshipApplicationById(id);

    if (!existingApplication) {
      res.status(404).json({
        success: false,
        message: "Mentorship application not found",
      });
      return;
    }

    const { status } = req.body ?? {};

    if (
      status !== undefined &&
      !validStatuses.includes(status)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid status. Use pending, approved or rejected",
      });
      return;
    }

    const oldStatus = existingApplication.status;

    const statusChanged =
      status !== undefined && status !== oldStatus;

    // Increment enrollment when an application becomes approved.
    if (status === "approved" && oldStatus !== "approved") {
      await incrementEnrolledCount(
        existingApplication.program_id
      );
    }

    const updated = await updateMentorshipApplication(id, {
      status,
    });

    if (!updated) {
      // Undo enrollment increment if the update fails.
      if (status === "approved" && oldStatus !== "approved") {
        await decrementEnrolledCount(
          existingApplication.program_id
        );
      }

      res.status(400).json({
        success: false,
        message: "No changes were made",
      });
      return;
    }

    // Release the seat if an approved application changes status.
    if (
      oldStatus === "approved" &&
      status !== undefined &&
      status !== "approved"
    ) {
      await decrementEnrolledCount(
        existingApplication.program_id
      );
    }

    const updatedApplication =
      await getMentorshipApplicationById(id);

    if (!updatedApplication) {
      res.status(500).json({
        success: false,
        message:
          "Application was updated but could not be retrieved",
      });
      return;
    }

    let emailSent: boolean | null = null;
    let emailMessage = "";

    // Send an email only when the application status changes.
    if (statusChanged && status !== undefined) {
      try {
        console.log("Sending mentorship status email...");
        console.log("Application ID:", id);
        console.log("New status:", status);
        console.log("Applicant email:", updatedApplication.email);

        await sendMentorshipStatusEmail(
          updatedApplication,
          status as ApplicationStatus
        );

        emailSent = true;
        emailMessage =
          " Status notification email sent successfully.";

        console.log(
          `Mentorship status email sent successfully: ${status}`
        );
      } catch (emailError) {
        emailSent = false;

        console.error(
          "Mentorship status email error:",
          emailError
        );

        emailMessage =
          " Status was saved, but the notification email could not be sent. Check your SMTP settings.";
      }
    }

    res.status(200).json({
      success: true,
      message:
        `Mentorship application updated successfully.${emailMessage}`,
      emailSent,
      data: updatedApplication,
    });
  } catch (error) {
    console.error("Update mentorship application error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update mentorship application",
    });
  }
};

/**
 * DELETE /api/mentorship-applications/:id
 */
export const deleteMentorshipApplicationController = async (
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

    const application =
      await getMentorshipApplicationById(id);

    if (!application) {
      res.status(404).json({
        success: false,
        message: "Mentorship application not found",
      });
      return;
    }

    if (application.status === "approved") {
      await decrementEnrolledCount(application.program_id);
    }

    await deleteMentorshipApplication(id);

    res.status(200).json({
      success: true,
      message: "Mentorship application deleted successfully",
    });
  } catch (error) {
    console.error("Delete mentorship application error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete mentorship application",
    });
  }
};

/**
 * GET /api/mentorship-applications/status/:status
 */
export const getMentorshipApplicationsByStatusController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const status = req.params.status;

    if (!validStatuses.includes(status as ApplicationStatus)) {
      res.status(400).json({
        success: false,
        message: "Invalid status. Use pending, approved or rejected",
      });
      return;
    }

    const applications =
      await getMentorshipApplicationsByStatus(
        status as ApplicationStatus
      );

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error(
      "Get mentorship applications by status error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to get mentorship applications",
    });
  }
};
