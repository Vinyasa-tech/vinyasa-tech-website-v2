
import pool from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export type ApplicationStatus =
  | "new"
  | "reviewing"
  | "shortlisted"
  | "rejected"
  | "hired";

export interface Qualification {
  course: string;
  year: string;
  collegeName: string;
}

export interface JobApplication {
  id: number;
  job_id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  experience: string | null;
  qualifications: Qualification[];
  technical_skills: string[];
  status: ApplicationStatus;
  applied_at: Date;
  updated_at: Date;
  job_title?: string;
  department?: string | null;
}

export interface CreateJobApplicationData {
  job_id: number;
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  experience?: string;
  qualifications: Qualification[];
  technical_skills: string[];
}

export interface UpdateJobApplicationData {
  status?: ApplicationStatus;
}

/**
 * Candidate-facing application response.
 * Application ID and personal application details
 * are intentionally not included.
 */
export interface CandidateApplication {
  job_id: number;
  job_title: string | null;
  location: string | null;
  employment_type: string | null;
  status: ApplicationStatus;
  applied_at: Date;
  updated_at: Date;
}

/**
 * Shared SELECT query for admin application records.
 */
const APPLICATION_SELECT = `
  SELECT
    ja.id,
    ja.job_id,
    ja.first_name,
    ja.last_name,
    ja.email,
    ja.phone,
    ja.experience,
    ja.qualifications,
    ja.technical_skills,
    ja.status,
    ja.applied_at,
    ja.updated_at,
    jo.title AS job_title,
    jo.department
  FROM job_applications ja
  LEFT JOIN job_openings jo ON ja.job_id = jo.id
`;

/**
 * Safely parse JSON fields returned by MySQL.
 */
function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null) {
    return fallback;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  return value as T;
}

/**
 * Normalize an application row.
 */
function normalizeApplication(
  row: RowDataPacket
): JobApplication {
  return {
    ...row,
    qualifications: parseJson<Qualification[]>(
      row.qualifications,
      []
    ),
    technical_skills: parseJson<string[]>(
      row.technical_skills,
      []
    ),
  } as JobApplication;
}

/**
 * Get all applications.
 */
export const getAllJobApplications = async (): Promise<
  JobApplication[]
> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `${APPLICATION_SELECT}
     ORDER BY ja.id DESC`
  );

  return rows.map(normalizeApplication);
};

/**
 * Get one application by ID.
 */
export const getJobApplicationById = async (
  id: number
): Promise<JobApplication | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `${APPLICATION_SELECT}
     WHERE ja.id = ?
     LIMIT 1`,
    [id]
  );

  return rows.length
    ? normalizeApplication(rows[0])
    : null;
};

/**
 * Get applications for a particular job.
 */
export const getApplicationsByJobId = async (
  jobId: number
): Promise<JobApplication[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `${APPLICATION_SELECT}
     WHERE ja.job_id = ?
     ORDER BY ja.id DESC`,
    [jobId]
  );

  return rows.map(normalizeApplication);
};

/**
 * Check whether a candidate has already applied
 * for the same job using their email address.
 */
export const hasCandidateApplied = async (
  jobId: number,
  email: string
): Promise<boolean> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `
    SELECT id
    FROM job_applications
    WHERE job_id = ?
      AND email = ?
    LIMIT 1
    `,
    [jobId, email.trim().toLowerCase()]
  );

  return rows.length > 0;
};

/**
 * Create a new application.
 */
export const createJobApplication = async (
  data: CreateJobApplicationData
): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `
    INSERT INTO job_applications (
      job_id,
      first_name,
      last_name,
      email,
      phone,
      experience,
      qualifications,
      technical_skills,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.job_id,
      data.first_name.trim(),
      data.last_name?.trim() || null,
      data.email.trim().toLowerCase(),
      data.phone?.trim() || null,
      data.experience?.trim() || null,
      JSON.stringify(data.qualifications ?? []),
      JSON.stringify(data.technical_skills ?? []),
      "new",
    ]
  );

  return result.insertId;
};

/**
 * Update application status only.
 */
export const updateJobApplication = async (
  id: number,
  data: UpdateJobApplicationData
): Promise<boolean> => {
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (data.status !== undefined) {
    fields.push("status = ?");
    values.push(data.status);
  }

  if (fields.length === 0) {
    return false;
  }

  values.push(id);

  const [result] = await pool.execute<ResultSetHeader>(
    `
    UPDATE job_applications
    SET ${fields.join(", ")},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
    `,
    values
  );

  return result.affectedRows > 0;
};

/**
 * Delete an application.
 */
export const deleteJobApplication = async (
  id: number
): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `
    DELETE FROM job_applications
    WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows > 0;
};

/**
 * Get applications by status.
 */
export const getJobApplicationsByStatus = async (
  status: ApplicationStatus
): Promise<JobApplication[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `${APPLICATION_SELECT}
     WHERE ja.status = ?
     ORDER BY ja.id DESC`,
    [status]
  );

  return rows.map(normalizeApplication);
};

/**
 * Get total application count.
 */
export const getTotalJobApplications = async (): Promise<number> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT COUNT(*) AS total
    FROM job_applications
    `
  );

  return Number(rows[0].total);
};

/**
 * Get new application count.
 */
export const getNewJobApplicationsCount =
  async (): Promise<number> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT COUNT(*) AS total
      FROM job_applications
      WHERE status = 'new'
      `
    );

    return Number(rows[0].total);
  };

/**
 * Get applications belonging to the logged-in candidate.
 *
 * Candidate identity comes from the verified JWT candidate ID.
 * The email is retrieved from the candidates table, not from
 * a value supplied by the frontend.
 */
export const getCandidateApplicationsById = async (
  candidateId: number
): Promise<CandidateApplication[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `
    SELECT
      ja.job_id,
      jo.title AS job_title,
      jo.location,
      jo.employment_type,
      ja.status,
      ja.applied_at,
      ja.updated_at
    FROM job_applications ja
    INNER JOIN candidates c
      ON LOWER(ja.email) = LOWER(c.email)
    LEFT JOIN job_openings jo
      ON ja.job_id = jo.id
    WHERE c.id = ?
    ORDER BY ja.applied_at DESC
    `,
    [candidateId]
  );

  return rows as CandidateApplication[];
};
