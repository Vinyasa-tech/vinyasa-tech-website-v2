import axios from "axios";

const API_URL =
  `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}` +
  "/mentorship-programs";

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
  const response = await axios.get(API_URL);

  const result = response.data?.data ?? response.data;

  if (!Array.isArray(result)) {
    throw new Error("Invalid mentorship programs response.");
  }

  return result;
}