
import { Request, Response } from "express";

import {
  getAllMentorshipPrograms,
  getMentorshipProgramById,
  createMentorshipProgram,
  updateMentorshipProgram,
  deleteMentorshipProgram,
  getMentorshipProgramsByStatus,
  type WeeklyPlanItem,
  type MentorshipStatus,
} from "../models/mentorshipProgramModel";

const VALID_STATUSES: MentorshipStatus[] = [
  "active",
  "inactive",
  "upcoming",
  "completed",
];

const parseWeeklyPlan = (
  value: unknown
): WeeklyPlanItem[] | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    return [];
  }

  let parsed: unknown = value;

  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      throw new Error("Weekly plan must contain valid JSON.");
    }
  }

  if (!Array.isArray(parsed)) {
    throw new Error("Weekly plan must be an array.");
  }

  return parsed.map((item: unknown, index: number) => {
    if (!item || typeof item !== "object") {
      throw new Error(`Invalid weekly plan entry ${index + 1}.`);
    }

    const entry = item as Record<string, unknown>;
    const week =
      typeof entry.week === "string" ? entry.week.trim() : "";
    const topic =
      typeof entry.topic === "string" ? entry.topic.trim() : "";
    const description =
      typeof entry.description === "string"
        ? entry.description.trim()
        : "";

    if (!week || !topic) {
      throw new Error(
        `Week and topic are required for weekly plan entry ${index + 1}.`
      );
    }

    return { week, topic, description };
  });
};

const parseOptionalNumber = (
  value: unknown,
  fieldName: string
): number | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${fieldName} must be a valid non-negative number.`);
  }

  return parsed;
};

const validateDates = (
  startDate: unknown,
  endDate: unknown
): boolean => {
  if (!startDate || !endDate) {
    return true;
  }

  const start = new Date(String(startDate));
  const end = new Date(String(endDate));

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return false;
  }

  return start <= end;
};

/**
 * GET /api/mentorship-programs
 * Public: get all programs.
 */
export const getMentorshipPrograms = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const programs = await getAllMentorshipPrograms();

    res.status(200).json({
      success: true,
      data: programs,
    });
  } catch (error) {
    console.error("Get mentorship programs error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get mentorship programs.",
    });
  }
};

/**
 * GET /api/mentorship-programs/:id
 * Public: get one program.
 */
export const getMentorshipProgram = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid program ID.",
      });
      return;
    }

    const program = await getMentorshipProgramById(id);

    if (!program) {
      res.status(404).json({
        success: false,
        message: "Mentorship program not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: program,
    });
  } catch (error) {
    console.error("Get mentorship program error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get mentorship program.",
    });
  }
};

/**
 * POST /api/mentorship-programs
 * Admin: create a program.
 */
export const createMentorshipProgramController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      mentor_name,
      mentor_email,
      category,
      duration,
      start_date,
      end_date,
      capacity,
      image_url,
      status,
      weekly_plan,
    } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      res.status(400).json({
        success: false,
        message: "Program title is required.",
      });
      return;
    }

    if (!validateDates(start_date, end_date)) {
      res.status(400).json({
        success: false,
        message: "Enter valid dates; the start date cannot be after the end date.",
      });
      return;
    }

    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid program status.",
      });
      return;
    }

    let parsedPlan: WeeklyPlanItem[] | undefined;
    let parsedCapacity: number | undefined;

    try {
      parsedPlan = parseWeeklyPlan(weekly_plan);
      parsedCapacity = parseOptionalNumber(capacity, "Capacity");
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Invalid program data.",
      });
      return;
    }

    const adminId = (
      req as Request & { adminId?: number }
    ).adminId;

    const programId = await createMentorshipProgram({
      title: title.trim(),
      description,
      mentor_name,
      mentor_email,
      category,
      duration,
      start_date,
      end_date,
      capacity: parsedCapacity,
      image_url,
      weekly_plan: parsedPlan,
      status,
      created_by: adminId,
    });

    const program = await getMentorshipProgramById(programId);

    res.status(201).json({
      success: true,
      message: "Mentorship program created successfully.",
      data: program,
    });
  } catch (error) {
    console.error("Create mentorship program error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create mentorship program.",
    });
  }
};

/**
 * PUT /api/mentorship-programs/:id
 * Admin: update a program.
 */
export const updateMentorshipProgramController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid program ID.",
      });
      return;
    }

    const existingProgram = await getMentorshipProgramById(id);

    if (!existingProgram) {
      res.status(404).json({
        success: false,
        message: "Mentorship program not found.",
      });
      return;
    }

    const {
      title,
      description,
      mentor_name,
      mentor_email,
      category,
      duration,
      start_date,
      end_date,
      capacity,
      enrolled_count,
      image_url,
      status,
      weekly_plan,
    } = req.body;

    if (
      title !== undefined &&
      (typeof title !== "string" || !title.trim())
    ) {
      res.status(400).json({
        success: false,
        message: "Program title cannot be empty.",
      });
      return;
    }

    if (!validateDates(start_date, end_date)) {
      res.status(400).json({
        success: false,
        message: "Enter valid dates; the start date cannot be after the end date.",
      });
      return;
    }

    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid program status.",
      });
      return;
    }

    let parsedPlan: WeeklyPlanItem[] | undefined;
    let parsedCapacity: number | undefined;
    let parsedEnrolledCount: number | undefined;

    try {
      parsedPlan = parseWeeklyPlan(weekly_plan);
      parsedCapacity = parseOptionalNumber(capacity, "Capacity");
      parsedEnrolledCount = parseOptionalNumber(
        enrolled_count,
        "Enrolled count"
      );
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Invalid program data.",
      });
      return;
    }

    const finalCapacity =
      parsedCapacity ?? existingProgram.capacity;
    const finalEnrolledCount =
      parsedEnrolledCount ?? existingProgram.enrolled_count;

    if (finalEnrolledCount > finalCapacity) {
      res.status(400).json({
        success: false,
        message: "Enrolled count cannot be greater than capacity.",
      });
      return;
    }

    const updated = await updateMentorshipProgram(id, {
      title: title !== undefined ? title.trim() : undefined,
      description,
      mentor_name,
      mentor_email,
      category,
      duration,
      start_date,
      end_date,
      capacity: parsedCapacity,
      enrolled_count: parsedEnrolledCount,
      image_url,
      weekly_plan: parsedPlan,
      status,
    });

    if (!updated) {
      res.status(400).json({
        success: false,
        message: "No changes were made.",
      });
      return;
    }

    const updatedProgram = await getMentorshipProgramById(id);

    res.status(200).json({
      success: true,
      message: "Mentorship program updated successfully.",
      data: updatedProgram,
    });
  } catch (error) {
    console.error("Update mentorship program error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update mentorship program.",
    });
  }
};

/**
 * DELETE /api/mentorship-programs/:id
 * Admin: delete a program.
 */
export const deleteMentorshipProgramController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid program ID.",
      });
      return;
    }

    const existingProgram = await getMentorshipProgramById(id);

    if (!existingProgram) {
      res.status(404).json({
        success: false,
        message: "Mentorship program not found.",
      });
      return;
    }

    await deleteMentorshipProgram(id);

    res.status(200).json({
      success: true,
      message: "Mentorship program deleted successfully.",
    });
  } catch (error) {
    console.error("Delete mentorship program error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete mentorship program.",
    });
  }
};

/**
 * GET /api/mentorship-programs/status/:status
 * Public: get programs by status.
 */
export const getMentorshipProgramsByStatusController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const status = req.params.status as MentorshipStatus;

    if (!VALID_STATUSES.includes(status)) {
      res.status(400).json({
        success: false,
        message:
          "Invalid status. Use active, inactive, upcoming or completed.",
      });
      return;
    }

    const programs = await getMentorshipProgramsByStatus(status);

    res.status(200).json({
      success: true,
      data: programs,
    });
  } catch (error) {
    console.error("Get mentorship programs by status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get mentorship programs.",
    });
  }
};
