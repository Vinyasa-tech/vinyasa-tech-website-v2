
import pool from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface SuccessStory {
  id: number;
  name: string;
  program: string | null;
  year: string | null;
  role: string | null;
  company: string | null;
  title: string | null;
  story: string;
  image_url: string | null;
  status: "published" | "draft";
  created_by: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateSuccessStoryData {
  name: string;
  program?: string | null;
  year?: string | null;
  role?: string | null;
  company?: string | null;
  title?: string | null;
  story: string;
  image_url?: string | null;
  status?: "published" | "draft";
  created_by?: number | null;
}

export interface UpdateSuccessStoryData {
  name?: string;
  program?: string | null;
  year?: string | null;
  role?: string | null;
  company?: string | null;
  title?: string | null;
  story?: string;
  image_url?: string | null;
  status?: "published" | "draft";
}

// GET ALL SUCCESS STORIES
export const getAllSuccessStories = async (): Promise<SuccessStory[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT
      id, name, program, year, role, company, title, story,
      image_url, status, created_by, created_at, updated_at
     FROM success_stories
     ORDER BY id ASC`
  );

  return rows as SuccessStory[];
};

// GET SINGLE SUCCESS STORY
export const getSuccessStoryById = async (
  id: number
): Promise<SuccessStory | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT
      id, name, program, year, role, company, title, story,
      image_url, status, created_by, created_at, updated_at
     FROM success_stories
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows.length ? (rows[0] as SuccessStory) : null;
};

// CREATE SUCCESS STORY
export const createSuccessStory = async (
  data: CreateSuccessStoryData
): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO success_stories
      (
        name, program, year, role, company, title,
        story, image_url, status, created_by
      )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.program ?? null,
      data.year ?? null,
      data.role ?? null,
      data.company ?? null,
      data.title ?? null,
      data.story,
      data.image_url ?? null,
      data.status ?? "draft",
      data.created_by ?? null,
    ]
  );

  return result.insertId;
};

// UPDATE SUCCESS STORY
export const updateSuccessStory = async (
  id: number,
  data: UpdateSuccessStoryData
): Promise<boolean> => {
  const fields: string[] = [];
  const values: (string | null | number)[] = [];

  if (data.name !== undefined) {
    fields.push("name = ?");
    values.push(data.name);
  }

  if (data.program !== undefined) {
    fields.push("program = ?");
    values.push(data.program);
  }

  if (data.year !== undefined) {
    fields.push("year = ?");
    values.push(data.year);
  }

  if (data.role !== undefined) {
    fields.push("role = ?");
    values.push(data.role);
  }

  if (data.company !== undefined) {
    fields.push("company = ?");
    values.push(data.company);
  }

  if (data.title !== undefined) {
    fields.push("title = ?");
    values.push(data.title);
  }

  if (data.story !== undefined) {
    fields.push("story = ?");
    values.push(data.story);
  }

  // IMAGE UPDATE / REMOVE
  // undefined = retain existing image
  // null = remove existing image
  // string = save new image path
  if (data.image_url !== undefined) {
    fields.push("image_url = ?");
    values.push(data.image_url);
  }

  if (data.status !== undefined) {
    fields.push("status = ?");
    values.push(data.status);
  }

  if (fields.length === 0) {
    return false;
  }

  values.push(id);

  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE success_stories
     SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    values
  );

  return result.affectedRows > 0;
};

// DELETE SUCCESS STORY
export const deleteSuccessStory = async (
  id: number
): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `DELETE FROM success_stories WHERE id = ?`,
    [id]
  );

  return result.affectedRows > 0;
};

// GET PUBLISHED SUCCESS STORIES
export const getPublishedSuccessStories = async (): Promise<
  SuccessStory[]
> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT
      id, name, program, year, role, company, title, story,
      image_url, status, created_by, created_at, updated_at
     FROM success_stories
     WHERE status = 'published'
     ORDER BY id ASC`
  );

  return rows as SuccessStory[];
};

// GET STORIES BY STATUS
export const getSuccessStoriesByStatus = async (
  status: "published" | "draft"
): Promise<SuccessStory[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT
      id, name, program, year, role, company, title, story,
      image_url, status, created_by, created_at, updated_at
     FROM success_stories
     WHERE status = ?
     ORDER BY id ASC`,
    [status]
  );

  return rows as SuccessStory[];
};
