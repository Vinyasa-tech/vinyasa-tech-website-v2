
import pool from "../config/database";
import {
  RowDataPacket,
  ResultSetHeader,
} from "mysql2";

// =====================================
// PROJECT INTERFACES
// =====================================

export interface Project {
  id: number;
  title: string;
  logo: string;
  description: string;
  website: string | null;
  status: "published" | "draft";
  created_at: Date;
  updated_at: Date;
}

export interface CreateProjectData {
  title: string;
  logo: string;
  description: string;
  website?: string | null;
  status?: "published" | "draft";
}

export type UpdateProjectData = Partial<CreateProjectData>;

// =====================================
// GET ALL PROJECTS (ADMIN)
// =====================================

export const getAllProjects = async (): Promise<Project[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT
      id,
      title,
      logo,
      description,
      website,
      status,
      created_at,
      updated_at
     FROM projects
     ORDER BY id ASC`
  );

  return rows as Project[];
};

// =====================================
// GET PUBLISHED PROJECTS (PUBLIC)
// =====================================

export const getPublishedProjects = async (): Promise<Project[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT
      id,
      title,
      logo,
      description,
      website,
      status,
      created_at,
      updated_at
     FROM projects
     WHERE status = 'published'
     ORDER BY id ASC`
  );

  return rows as Project[];
};

// =====================================
// GET PROJECT BY ID
// =====================================

export const getProjectById = async (
  id: number
): Promise<Project | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT
      id,
      title,
      logo,
      description,
      website,
      status,
      created_at,
      updated_at
     FROM projects
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows.length
    ? (rows[0] as Project)
    : null;
};

// =====================================
// CREATE PROJECT
// =====================================

export const createProject = async (
  data: CreateProjectData
): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO projects
      (
        title,
        logo,
        description,
        website,
        status
      )
     VALUES (?, ?, ?, ?, ?)`,
    [
      data.title,
      data.logo,
      data.description,
      data.website ?? null,
      data.status ?? "published",
    ]
  );

  return result.insertId;
};

// =====================================
// UPDATE PROJECT
// =====================================

export const updateProject = async (
  id: number,
  data: UpdateProjectData
): Promise<boolean> => {
  const allowedFields: (keyof UpdateProjectData)[] = [
    "title",
    "logo",
    "description",
    "website",
    "status",
  ];

  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  for (const field of allowedFields) {
    const value = data[field];

    if (value !== undefined) {
      fields.push(`${field} = ?`);
      values.push(value ?? null);
    }
  }

  if (fields.length === 0) {
    return false;
  }

  values.push(id);

  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE projects
     SET ${fields.join(", ")}
     WHERE id = ?`,
    values
  );

  return result.affectedRows > 0;
};

// =====================================
// DELETE PROJECT
// =====================================

export const deleteProject = async (
  id: number
): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `DELETE FROM projects
     WHERE id = ?`,
    [id]
  );

  return result.affectedRows > 0;
};
