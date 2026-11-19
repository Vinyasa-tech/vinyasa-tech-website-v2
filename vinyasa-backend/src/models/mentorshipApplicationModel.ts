
import pool from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface MentorshipApplication {
  id: number;
  program_id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  city: string | null;
  college: string | null;
  course: string | null;
  graduation_year: number | null;
  duration: string | null;
  program_preference: "Internship Only" | "Course + Internship";
  education: string | null;
  goals: string | null;
  additional_message: string | null;
  status: ApplicationStatus;
  applied_at: Date;
  updated_at: Date;
  program_title?: string;
}

export interface CreateMentorshipApplicationData {
  program_id: number;
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  city?: string;
  college?: string;
  course?: string;
  graduation_year?: number;
  duration?: string;
  program_preference: "Internship Only" | "Course + Internship";
  education?: string;
  goals?: string;
  additional_message?: string;
}

export interface UpdateMentorshipApplicationData {
  status?: ApplicationStatus;
}

const APPLICATION_SELECT = `
  SELECT
    ma.id,
    ma.program_id,
    ma.first_name,
    ma.last_name,
    ma.email,
    ma.phone,
    ma.city,
    ma.college,
    ma.course,
    ma.graduation_year,
    ma.duration,
    ma.program_preference,
    ma.education,
    ma.goals,
    ma.additional_message,
    ma.status,
    ma.applied_at,
    ma.updated_at,
    mp.title AS program_title
  FROM mentorship_applications ma
  LEFT JOIN mentorship_programs mp
    ON ma.program_id = mp.id
`;

export const getAllMentorshipApplications =
  async (): Promise<MentorshipApplication[]> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      `${APPLICATION_SELECT} ORDER BY ma.id DESC`
    );

    return rows as MentorshipApplication[];
  };

export const getMentorshipApplicationById = async (
  id: number
): Promise<MentorshipApplication | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `${APPLICATION_SELECT} WHERE ma.id = ? LIMIT 1`,
    [id]
  );

  return rows.length > 0
    ? (rows[0] as MentorshipApplication)
    : null;
};

export const getApplicationsByProgramId = async (
  programId: number
): Promise<MentorshipApplication[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `${APPLICATION_SELECT}
     WHERE ma.program_id = ?
     ORDER BY ma.id DESC`,
    [programId]
  );

  return rows as MentorshipApplication[];
};

export const createMentorshipApplication = async (
  data: CreateMentorshipApplicationData
): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO mentorship_applications (
      program_id,
      first_name,
      last_name,
      email,
      phone,
      city,
      college,
      course,
      graduation_year,
      duration,
      program_preference,
      education,
      goals,
      additional_message
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.program_id,
      data.first_name,
      data.last_name || null,
      data.email,
      data.phone || null,
      data.city || null,
      data.college || null,
      data.course || null,
      data.graduation_year ?? null,
      data.duration || null,
      data.program_preference,
      data.education || null,
      data.goals || null,
      data.additional_message || null,
    ]
  );

  return result.insertId;
};

export const updateMentorshipApplication = async (
  id: number,
  data: UpdateMentorshipApplicationData
): Promise<boolean> => {
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (data.status !== undefined) {
    fields.push("status = ?");
    values.push(data.status);
  }

  if (fields.length === 0) {
    return false;
  }

  values.push(id);

  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE mentorship_applications
     SET ${fields.join(", ")}
     WHERE id = ?`,
    values
  );

  return result.affectedRows > 0;
};

export const deleteMentorshipApplication = async (
  id: number
): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `DELETE FROM mentorship_applications WHERE id = ?`,
    [id]
  );

  return result.affectedRows > 0;
};

export const getMentorshipApplicationsByStatus = async (
  status: ApplicationStatus
): Promise<MentorshipApplication[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `${APPLICATION_SELECT}
     WHERE ma.status = ?
     ORDER BY ma.id DESC`,
    [status]
  );

  return rows as MentorshipApplication[];
};

export const getTotalMentorshipApplications =
  async (): Promise<number> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total
       FROM mentorship_applications`
    );

    return Number(rows[0].total);
  };

export const getPendingMentorshipApplicationsCount =
  async (): Promise<number> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS total
       FROM mentorship_applications
       WHERE status = 'pending'`
    );

    return Number(rows[0].total);
  };
