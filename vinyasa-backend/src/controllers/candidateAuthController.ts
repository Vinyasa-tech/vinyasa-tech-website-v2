
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  createCandidate,
  getCandidateByEmail,
} from "../models/candidateModel";

import {
  getCandidateApplicationsById,
} from "../models/jobApplicationModel";

import {
  CandidateAuthRequest,
} from "../middleware/candidateAuthMiddleware";

const JWT_SECRET: string = process.env.JWT_SECRET || "";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from the environment variables");
}

/**
 * Candidate registration.
 */
export async function registerCandidate(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      password.length < 8
    ) {
      res.status(400).json({
        success: false,
        message:
          "Enter your name, a valid email, and a password of at least 8 characters.",
      });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingCandidate = await getCandidateByEmail(
      normalizedEmail
    );

    if (existingCandidate) {
      res.status(409).json({
        success: false,
        message: "This email is already registered. Please log in.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const candidateId = await createCandidate(
      name.trim(),
      normalizedEmail,
      hashedPassword
    );

    res.status(201).json({
      success: true,
      message: "Registration successful. You can now log in.",
      data: {
        candidate: {
          id: candidateId,
          name: name.trim(),
          email: normalizedEmail,
        },
      },
    });
  } catch (error) {
    const dbError = error as { code?: string };

    if (dbError.code === "ER_DUP_ENTRY") {
      res.status(409).json({
        success: false,
        message: "This email is already registered. Please log in.",
      });
      return;
    }

    console.error("Candidate registration error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to register. Please try again.",
    });
  }
}

/**
 * Candidate login.
 */
export async function loginCandidate(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
      return;
    }

    const candidate = await getCandidateByEmail(
      email.trim().toLowerCase()
    );

    if (
      !candidate ||
      !(await bcrypt.compare(password, candidate.password))
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: candidate.id,
        role: "candidate",
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        token,
        candidate: {
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
        },
      },
    });
  } catch (error) {
    console.error("Candidate login error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to log in. Please try again.",
    });
  }
}

/**
 * Get applications for the currently logged-in candidate.
 */
export async function getMyCandidateApplications(
  req: CandidateAuthRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.candidateId) {
      res.status(401).json({
        success: false,
        message: "Please log in to view your applications.",
      });
      return;
    }

    const applications = await getCandidateApplicationsById(
      req.candidateId
    );

    res.status(200).json({
      success: true,
      message: "Your applications were retrieved successfully.",
      data: applications,
    });
  } catch (error) {
    console.error("Candidate applications error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load your applications. Please try again.",
    });
  }
}

