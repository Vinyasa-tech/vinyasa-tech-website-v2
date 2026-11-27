import axios from "axios";
import { API_URL } from "../config/constants";

const MENTORSHIP_PROGRAMS_API_URL =
  `${API_URL}/mentorship-programs`;

export interface WeeklyPlanItem {
  week: number;
  topic: string;
  description?: string;
}

export interface MentorshipProgram {
  id: number;
  title: string;
  description: string;
  duration: string;
  category?: string;
  status: string;
  weekly_plan?: WeeklyPlanItem[] | string | null;
}

export async function getMentorshipPrograms(): Promise<MentorshipProgram[]> {
  const response = await axios.get(MENTORSHIP_PROGRAMS_API_URL);

  const result = response.data?.data ?? response.data;

  if (!Array.isArray(result)) {
    throw new Error("Invalid mentorship programs response.");
  }

  return result;
}