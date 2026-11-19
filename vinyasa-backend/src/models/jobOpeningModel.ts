
import pool from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export type EmploymentType =
  | "Full Time"
  | "Part Time"
  | "Contract"
  | "Internship";

export type WorkMode = "On-site" | "Hybrid" | "Remote";
export type JobStatus = "open" | "closed" | "draft";

export interface JobOpening {
  id: number;
  title: string;
  department: string | null;
  location: string | null;
  employment_type: EmploymentType;
  work_mode: WorkMode;
  description: string | null;
  responsibilities: string | null;
  required_skills: string | null;
  qualifications: string | null;
  experience: string | null;
  status: JobStatus;
  application_deadline: Date | null;
  created_by: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateJobOpeningData {
  title: string;
  department?: string | null;
  location?: string | null;
  employment_type?: EmploymentType;
  work_mode?: WorkMode;
  description?: string | null;
  responsibilities?: string | null;
  required_skills?: string | null;
  qualifications?: string | null;
  experience?: string | null;
  status?: JobStatus;
  application_deadline?: string | null;
  created_by?: number | null;
}

export type UpdateJobOpeningData = Partial<
  Omit<CreateJobOpeningData, "created_by">
>;

const JOB_COLUMNS = `
  id,
  title,
  department,
  location,
  employment_type,
  work_mode,
  description,
  responsibilities,
  required_skills,
  qualifications,
  experience,
  status,
  application_deadline,
  created_by,
  created_at,
  updated_at
`;

export const getAllJobOpenings = async (): Promise<JobOpening[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT ${JOB_COLUMNS}
     FROM job_openings
     ORDER BY id DESC`
  );

  return rows as JobOpening[];
};

export const getJobOpeningById = async (
  id: number
): Promise<JobOpening | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT ${JOB_COLUMNS}
     FROM job_openings
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows.length ? (rows[0] as JobOpening) : null;
};

export const createJobOpening = async (
  data: CreateJobOpeningData
): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO job_openings (
      title,
      department,
      location,
      employment_type,
      work_mode,
      description,
      responsibilities,
      required_skills,
      qualifications,
      experience,
      status,
      application_deadline,
      created_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.title,
      data.department ?? null,
      data.location ?? null,
      data.employment_type ?? "Full Time",
      data.work_mode ?? "On-site",
      data.description ?? null,
      data.responsibilities ?? null,
      data.required_skills ?? null,
      data.qualifications ?? null,
      data.experience ?? null,
      data.status ?? "open",
      data.application_deadline || null,
      data.created_by ?? null,
    ]
  );

  return result.insertId;
};

export const updateJobOpening = async (
  id: number,
  data: UpdateJobOpeningData
): Promise<boolean> => {
  const allowedFields: (keyof UpdateJobOpeningData)[] = [
    "title",
    "department",
    "location",
    "employment_type",
    "work_mode",
    "description",
    "responsibilities",
    "required_skills",
    "qualifications",
    "experience",
    "status",
    "application_deadline",
  ];

  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      fields.push(`${field} = ?`);
      values.push(data[field] ?? null);
    }
  }

  if (fields.length === 0) return false;

  values.push(id);

  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE job_openings
     SET ${fields.join(", ")}
     WHERE id = ?`,
    values
  );

  return result.affectedRows > 0;
};

export const deleteJobOpening = async (
  id: number
): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `DELETE FROM job_openings WHERE id = ?`,
    [id]
  );

  return result.affectedRows > 0;
};

export const getJobOpeningsByStatus = async (
  status: JobStatus
): Promise<JobOpening[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT ${JOB_COLUMNS}
     FROM job_openings
     WHERE status = ?
     ORDER BY id DESC`,
    [status]
  );

  return rows as JobOpening[];
};
