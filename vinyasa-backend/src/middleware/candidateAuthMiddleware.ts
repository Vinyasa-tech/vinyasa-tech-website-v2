
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CandidateJwtPayload {
  id: number;
  role: string;
}

export interface CandidateAuthRequest extends Request {
  candidateId?: number;
}

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

export const protectCandidate = (
  req: CandidateAuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Please log in to view your applications.",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as CandidateJwtPayload;

    if (
      !decoded.id ||
      !Number.isInteger(decoded.id) ||
      decoded.role !== "candidate"
    ) {
      res.status(403).json({
        success: false,
        message: "Candidate access is required.",
      });
      return;
    }

    req.candidateId = decoded.id;

    next();
  } catch (error) {
    console.error("Candidate authentication error:", error);

    res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};
