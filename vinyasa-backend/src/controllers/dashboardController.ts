import { Request, Response } from "express";

import { getAllJobOpenings } from "../models/jobOpeningModel";

import {
  getAllJobApplications,
  getTotalJobApplications,
  getNewJobApplicationsCount,
} from "../models/jobApplicationModel";

import {
  getActiveMentorshipProgramsCount,
} from "../models/mentorshipProgramModel";

import {
  getAllMentorshipApplications,
  getTotalMentorshipApplications,
  getPendingMentorshipApplicationsCount,
} from "../models/mentorshipApplicationModel";

export const getDashboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      jobOpenings,
      totalJobApplications,
      newJobApplications,
      activeMentorshipPrograms,
      totalMentorshipApplications,
      pendingMentorshipApplications,
      jobApplications,
      mentorshipApplications,
    ] = await Promise.all([
      getAllJobOpenings(),
      getTotalJobApplications(),
      getNewJobApplicationsCount(),
      getActiveMentorshipProgramsCount(),
      getTotalMentorshipApplications(),
      getPendingMentorshipApplicationsCount(),
      getAllJobApplications(),
      getAllMentorshipApplications(),
    ]);

    // Job opening counts
    const totalJobOpenings = jobOpenings.length;

    const activeJobOpenings = jobOpenings.filter(
      (job) => job.status === "open"
    ).length;

    const closedJobOpenings = jobOpenings.filter(
      (job) => job.status === "closed"
    ).length;

    const draftJobOpenings = jobOpenings.filter(
      (job) => job.status === "draft"
    ).length;

    // Latest applications
    // The model query already returns applications in newest-first order.
    const recentJobApplications = jobApplications.slice(0, 5);

    const recentMentorshipApplications =
      mentorshipApplications.slice(0, 5);

    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",

      data: {
        summary: {
          totalJobOpenings,
          activeJobOpenings,
          closedJobOpenings,
          draftJobOpenings,

          totalJobApplications,
          newJobApplications,

          activeMentorshipPrograms,
          totalMentorshipApplications,
          pendingMentorshipApplications,
        },

        recentJobApplications,

        recentMentorshipApplications,
      },
    });
  } catch (error) {
    console.error("Get dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
};