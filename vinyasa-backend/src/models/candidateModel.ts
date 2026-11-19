
import pool from "../config/database";

export interface Candidate {
  id: number;
  name: string;
  email: string;
  password: string;
}

export async function getCandidateByEmail(
  email: string
): Promise<Candidate | null> {
  const [rows] = await pool.execute(
    "SELECT id, name, email, password FROM candidates WHERE email = ?",
    [email]
  );

  const candidates = rows as Candidate[];
  return candidates.length > 0 ? candidates[0] : null;
}

export async function createCandidate(
  name: string,
  email: string,
  hashedPassword: string
): Promise<number> {
  const [result] = await pool.execute(
    "INSERT INTO candidates (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword]
  );

  return (result as { insertId: number }).insertId;
}
