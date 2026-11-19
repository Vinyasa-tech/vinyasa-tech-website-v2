
import pool from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface AdminSettings {
  id: number;
  admin_id: number;

  // Existing notification preferences
  email_notifications: boolean;
  application_notifications: boolean;
  mentorship_notifications: boolean;
  job_notifications: boolean;



  // Website preferences
  maintenance_mode: boolean;
  show_job_openings: boolean;
  show_mentorship_programs: boolean;

  created_at: Date;
  updated_at: Date;
}

export interface CreateSettingsData {
  admin_id: number;

  email_notifications?: boolean;
  application_notifications?: boolean;
  mentorship_notifications?: boolean;
  job_notifications?: boolean;



  maintenance_mode?: boolean;
  show_job_openings?: boolean;
  show_mentorship_programs?: boolean;
}

export interface UpdateSettingsData {
  email_notifications?: boolean;
  application_notifications?: boolean;
  mentorship_notifications?: boolean;
  job_notifications?: boolean;



  maintenance_mode?: boolean;
  show_job_openings?: boolean;
  show_mentorship_programs?: boolean;
}

/**
 * Get settings for an admin
 */
export const getSettingsByAdminId = async (
  adminId: number
): Promise<AdminSettings | null> => {
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT
      id,
      admin_id,
      email_notifications,
      application_notifications,
      mentorship_notifications,
      job_notifications,
      maintenance_mode,
      show_job_openings,
      show_mentorship_programs,
      created_at,
      updated_at
    FROM admin_settings
    WHERE admin_id = ?
    LIMIT 1
    `,
    [adminId]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0] as AdminSettings;
};

/**
 * Create settings for an admin
 */
export const createSettings = async (
  data: CreateSettingsData
): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `
    INSERT INTO admin_settings
    (
      admin_id,
      email_notifications,
      application_notifications,
      mentorship_notifications,
      job_notifications,
      maintenance_mode,
      show_job_openings,
      show_mentorship_programs
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.admin_id,
      data.email_notifications ?? true,
      data.application_notifications ?? true,
      data.mentorship_notifications ?? true,
      data.job_notifications ?? true,
      data.maintenance_mode ?? false,
      data.show_job_openings ?? true,
      data.show_mentorship_programs ?? true,
    ]
  );

  return result.insertId;
};

/**
 * Update admin settings
 */
export const updateSettings = async (
  adminId: number,
  data: UpdateSettingsData
): Promise<boolean> => {
  const fields: string[] = [];

  const values: (string | number | boolean | null)[] = [];

  if (data.email_notifications !== undefined) {
    fields.push("email_notifications = ?");
    values.push(data.email_notifications);
  }

  if (data.application_notifications !== undefined) {
    fields.push("application_notifications = ?");
    values.push(data.application_notifications);
  }

  if (data.mentorship_notifications !== undefined) {
    fields.push("mentorship_notifications = ?");
    values.push(data.mentorship_notifications);
  }

  if (data.job_notifications !== undefined) {
    fields.push("job_notifications = ?");
    values.push(data.job_notifications);
  }


  if (data.maintenance_mode !== undefined) {
    fields.push("maintenance_mode = ?");
    values.push(data.maintenance_mode);
  }

  if (data.show_job_openings !== undefined) {
    fields.push("show_job_openings = ?");
    values.push(data.show_job_openings);
  }

  if (data.show_mentorship_programs !== undefined) {
    fields.push("show_mentorship_programs = ?");
    values.push(data.show_mentorship_programs);
  }

  if (fields.length === 0) {
    return false;
  }

  values.push(adminId);

  const [result] = await pool.execute<ResultSetHeader>(
    `
    UPDATE admin_settings
    SET ${fields.join(", ")}
    WHERE admin_id = ?
    `,
    values
  );

  return result.affectedRows > 0;
};

/**
 * Create default settings if they don't exist
 */
export const createDefaultSettingsIfNotExists =
  async (adminId: number): Promise<AdminSettings | null> => {
    const existingSettings = await getSettingsByAdminId(adminId);

    if (existingSettings) {
      return existingSettings;
    }

    await createSettings({
      admin_id: adminId,
    });

    return getSettingsByAdminId(adminId);
  };

/**
 * Delete admin settings
 */
export const deleteSettings = async (
  adminId: number
): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `
    DELETE FROM admin_settings
    WHERE admin_id = ?
    `,
    [adminId]
  );

  return result.affectedRows > 0;
};
