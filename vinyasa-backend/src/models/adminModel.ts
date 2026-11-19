import pool from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface Admin {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "admin" | "super_admin";
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateAdminData {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "super_admin";
}

export interface UpdateAdminData {
  name?: string;
  email?: string;
  role?: "admin" | "super_admin";
  is_active?: boolean;
}

/**
 * Get all admin
 */
export const getAllAdmin = async (): Promise<Admin[]> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT
      id,
      name,
      email,
      password,
      role,
      is_active,
      created_at,
      updated_at
    FROM admin
    ORDER BY id DESC
    `
  );

  return rows as Admin[];
};

/**
 * Get admin by ID
 */
export const getAdminById = async (
  id: number
): Promise<Admin | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT
      id,
      name,
      email,
      password,
      role,
      is_active,
      created_at,
      updated_at
    FROM admin
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0] as Admin;
};

/**
 * Get admin by email
 *
 * Used mainly during login.
 */
export const getAdminByEmail = async (
  email: string
): Promise<Admin | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT
      id,
      name,
      email,
      password,
      role,
      is_active,
      created_at,
      updated_at
    FROM admin
    WHERE email = ?
    LIMIT 1
    `,
    [email]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0] as Admin;
};

/**
 * Create a new admin
 */
export const createAdmin = async (
  data: CreateAdminData
): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `
    INSERT INTO admin
      (
        name,
        email,
        password,
        role
      )
    VALUES
      (?, ?, ?, ?)
    `,
    [
      data.name,
      data.email,
      data.password,
      data.role || "admin",
    ]
  );

  return result.insertId;
};

/**
 * Update admin
 */
export const updateAdmin = async (
  id: number,
  data: UpdateAdminData
): Promise<boolean> => {
  const fields: string[] = [];
  const values: (string | number | boolean | null)[] = [];

  if (data.name !== undefined) {
    fields.push("name = ?");
    values.push(data.name);
  }

  if (data.email !== undefined) {
    fields.push("email = ?");
    values.push(data.email);
  }

  if (data.role !== undefined) {
    fields.push("role = ?");
    values.push(data.role);
  }

  if (data.is_active !== undefined) {
    fields.push("is_active = ?");
    values.push(data.is_active);
  }

  if (fields.length === 0) {
    return false;
  }

  values.push(id);

  const [result] = await pool.execute<ResultSetHeader>(
    `
    UPDATE admin
    SET ${fields.join(", ")}
    WHERE id = ?
    `,
    values
  );

  return result.affectedRows > 0;
};



/**
 * Update admin password
 */
export const updateAdminPassword = async (
  id: number,
  password: string
): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `
    UPDATE admin
    SET password = ?
    WHERE id = ?
    `,
    [password, id]
  );

  return result.affectedRows > 0;
};

/**
 * Delete admin
 */
export const deleteAdmin = async (
  id: number
): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `
    DELETE FROM admin
    WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows > 0;
};