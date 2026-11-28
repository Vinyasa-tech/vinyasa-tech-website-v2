
import pool from "../config/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface WeeklyPlanItem {
  week: string;
  topic: string;
  description?: string;
}

export type MentorshipStatus =
  | "active"
  | "inactive"
  | "upcoming"
  | "completed";

export interface MentorshipProgram extends RowDataPacket {
  id: number;
  title: string;
  description: string | null;
  mentor_name: string | null;
  mentor_email: string | null;
  category: string | null;
  duration: string | null;
  start_date: Date | null;
  end_date: Date | null;
  capacity: number;
  enrolled_count: number;
  image_url: string | null;
  weekly_plan: WeeklyPlanItem[] | string | null;
  status: MentorshipStatus;
  created_by: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateMentorshipProgramData {
  title: string;
  description?: string | null;
  mentor_name?: string | null;
  mentor_email?: string | null;
  category?: string | null;
  duration?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  capacity?: number;
  image_url?: string | null;
  weekly_plan?: WeeklyPlanItem[] | string | null;
  status?: MentorshipStatus;
  created_by?: number | null;
}

export interface UpdateMentorshipProgramData {
  title?: string;
  description?: string | null;
  mentor_name?: string | null;
  mentor_email?: string | null;
  category?: string | null;
  duration?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  capacity?: number | null;
  enrolled_count?: number | null;
  image_url?: string | null;
  weekly_plan?: WeeklyPlanItem[] | string | null;
  status?: MentorshipStatus;
}

const SELECT_COLUMNS = `
  id,
  title,
  description,
  mentor_name,
  mentor_email,
  category,
  duration,
  start_date,
  end_date,
  capacity,
  enrolled_count,
  image_url,
  weekly_plan,
  status,
  created_by,
  created_at,
  updated_at
`;

const normalizeWeeklyPlan = (
  value: WeeklyPlanItem[] | string | null | undefined
): string | null => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed =
    typeof value === "string" ? JSON.parse(value) : value;

  if (!Array.isArray(parsed)) {
    throw new Error("weekly_plan must be an array");
  }

  const normalized: WeeklyPlanItem[] = parsed.map(
    (item: unknown, index: number) => {
      if (!item || typeof item !== "object") {
        throw new Error(`Invalid weekly_plan item at index ${index}`);
      }

      const planItem = item as Record<string, unknown>;
      const week =
        typeof planItem.week === "string"
          ? planItem.week.trim()
          : "";
      const topic =
        typeof planItem.topic === "string"
          ? planItem.topic.trim()
          : "";
      const description =
        typeof planItem.description === "string"
          ? planItem.description.trim()
          : "";

      if (!week || !topic) {
        throw new Error(
          `Each weekly_plan item requires a week and topic (item ${index + 1})`
        );
      }

      return {
        week,
        topic,
        description,
      };
    }
  );

  return JSON.stringify(normalized);
};

/**
 * Get all mentorship programs.
 */
export const getAllMentorshipPrograms =
  async (): Promise<MentorshipProgram[]> => {
    const [rows] = await pool.query<MentorshipProgram[]>(
      `
      SELECT ${SELECT_COLUMNS}
      FROM mentorship_programs
      ORDER BY id ASC
      `
    );

    return rows;
  };

/**
 * Get one mentorship program by ID.
 */
export const getMentorshipProgramById = async (
  id: number
): Promise<MentorshipProgram | null> => {
  const [rows] = await pool.query<MentorshipProgram[]>(
    `
    SELECT ${SELECT_COLUMNS}
    FROM mentorship_programs
    WHERE id = ?
    LIMIT 1
    `,
    [id]
  );

  return rows[0] ?? null;
};

/**
 * Create a mentorship program.
 */
export const createMentorshipProgram = async (
  data: CreateMentorshipProgramData
): Promise<number> => {
  const weeklyPlan = normalizeWeeklyPlan(data.weekly_plan);

  const [result] = await pool.execute<ResultSetHeader>(
    `
    INSERT INTO mentorship_programs (
      title,
      description,
      mentor_name,
      mentor_email,
      category,
      duration,
      start_date,
      end_date,
      capacity,
      image_url,
      weekly_plan,
      status,
      created_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.title,
      data.description ?? null,
      data.mentor_name ?? null,
      data.mentor_email ?? null,
      data.category ?? null,
      data.duration ?? null,
      data.start_date || null,
      data.end_date || null,
      data.capacity ?? 0,
      data.image_url ?? null,
      weeklyPlan,
      data.status ?? "upcoming",
      data.created_by ?? null,
    ]
  );

  return result.insertId;
};

/**
 * Update a mentorship program.
 * Only supplied fields are updated.
 */
export const updateMentorshipProgram = async (
  id: number,
  data: UpdateMentorshipProgramData
): Promise<boolean> => {
  const fields: string[] = [];
  const values: Array<string | number | null> = [];

  const addField = (
    column: string,
    value: string | number | null | undefined
  ) => {
    if (value !== undefined) {
      fields.push(`${column} = ?`);
      values.push(value);
    }
  };

  addField("title", data.title);
  addField("description", data.description);
  addField("mentor_name", data.mentor_name);
  addField("mentor_email", data.mentor_email);
  addField("category", data.category);
  addField("duration", data.duration);
  addField("start_date", data.start_date || (data.start_date === "" ? null : undefined));
  addField("end_date", data.end_date || (data.end_date === "" ? null : undefined));
  addField("capacity", data.capacity);
  addField("enrolled_count", data.enrolled_count);
  addField("image_url", data.image_url);

  if (data.weekly_plan !== undefined) {
    fields.push("weekly_plan = ?");
    values.push(normalizeWeeklyPlan(data.weekly_plan));
  }

  addField("status", data.status);

  if (fields.length === 0) {
    return false;
  }

  values.push(id);

  const [result] = await pool.execute<ResultSetHeader>(
    `
    UPDATE mentorship_programs
    SET ${fields.join(", ")}
    WHERE id = ?
    `,
    values
  );

  return result.affectedRows > 0;
};

/**
 * Delete a mentorship program.
 */
export const deleteMentorshipProgram = async (
  id: number
): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `
    DELETE FROM mentorship_programs
    WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows > 0;
};

/**
 * Get mentorship programs by status.
 */
export const getMentorshipProgramsByStatus = async (
  status: MentorshipStatus
): Promise<MentorshipProgram[]> => {
  const [rows] = await pool.query<MentorshipProgram[]>(
    `
    SELECT ${SELECT_COLUMNS}
    FROM mentorship_programs
    WHERE status = ?
    ORDER BY id ASC
    `,
    [status]
  );

  return rows;
};

/**
 * Increase enrolled count.
 */
export const incrementEnrolledCount = async (
  id: number
): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `
    UPDATE mentorship_programs
    SET enrolled_count = enrolled_count + 1
    WHERE id = ?
      AND enrolled_count < capacity
    `,
    [id]
  );

  return result.affectedRows > 0;
};

/**
 * Decrease enrolled count.
 */
export const decrementEnrolledCount = async (
  id: number
): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `
    UPDATE mentorship_programs
    SET enrolled_count =
      CASE
        WHEN enrolled_count > 0 THEN enrolled_count - 1
        ELSE 0
      END
    WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows > 0;
};

/**
 * Get active mentorship programs count.
 */
export const getActiveMentorshipProgramsCount =
  async (): Promise<number> => {
    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT COUNT(*) AS total
      FROM mentorship_programs
      WHERE status = 'active'
      `
    );

    return Number(rows[0]?.total ?? 0);
  };
