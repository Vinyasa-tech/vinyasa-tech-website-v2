import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  createAdmin,
  getAdminByEmail,
  getAdminById,
} from "../models/adminModel";

import { createDefaultSettingsIfNotExists } from "../models/settingsModel";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

/**
 * Generate JWT token
 */
const generateToken = (adminId: number): string => {
  return jwt.sign(
    {
      id: adminId,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

/**
 * Register Admin
 *
 * POST /api/auth/register
 */
export const registerAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });

      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters",
      });

      return;
    }

    // -----------------------------
    // Check existing admin
    // -----------------------------

    const existingAdmin = await getAdminByEmail(email);

    if (existingAdmin) {
      res.status(409).json({
        success: false,
        message: "An admin with this email already exists",
      });

      return;
    }

    // -----------------------------
    // Hash password
    // -----------------------------

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // -----------------------------
    // Create admin
    // -----------------------------

    const adminId = await createAdmin({
      name,
      email,
      password: hashedPassword,
      role: role || "admin",
    });

    // -----------------------------
    // Create default settings
    // -----------------------------

    await createDefaultSettingsIfNotExists(
      adminId
    );

    // -----------------------------
    // Generate token
    // -----------------------------

    const token = generateToken(adminId);

    // -----------------------------
    // Response
    // -----------------------------

    res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      data: {
        admin: {
          id: adminId,
          name,
          email,
          role: role || "admin",
        },
        token,
      },
    });
  } catch (error) {
    console.error(
      "Register admin error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create admin account",
    });
  }
};

/**
 * Login Admin
 *
 * POST /api/auth/login
 */
export const loginAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      email,
      password,
    } = req.body;

    // -----------------------------
    // Validation
    // -----------------------------

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });

      return;
    }

    // -----------------------------
    // Find admin
    // -----------------------------

    const admin = await getAdminByEmail(email);

    if (!admin) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

      return;
    }

    // -----------------------------
    // Check active status
    // -----------------------------

    if (!admin.is_active) {
      res.status(403).json({
        success: false,
        message: "Your admin account is inactive",
      });

      return;
    }

    // -----------------------------
    // Compare password
    // -----------------------------

    const passwordMatch =
      await bcrypt.compare(
        password,
        admin.password
      );

    if (!passwordMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

      return;
    }

    // -----------------------------
    // Generate JWT
    // -----------------------------

    const token = generateToken(admin.id);

    // -----------------------------
    // Make sure settings exist
    // -----------------------------

    await createDefaultSettingsIfNotExists(
      admin.id
    );

    // -----------------------------
    // Response
    // -----------------------------

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error(
      "Login admin error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

/**
 * Get currently logged-in admin
 *
 * GET /api/auth/me
 */
export const getCurrentAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    /**
     * authMiddleware will add adminId
     * to the request.
     */
    const adminId = (req as Request & {
      adminId?: number;
    }).adminId;

    if (!adminId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const admin = await getAdminById(adminId);

    if (!admin) {
      res.status(404).json({
        success: false,
        message: "Admin not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        is_active: admin.is_active,
        created_at: admin.created_at,
      },
    });
  } catch (error) {
    console.error(
      "Get current admin error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to get admin information",
    });
  }
};