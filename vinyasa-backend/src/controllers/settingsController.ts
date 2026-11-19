
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import {
  getSettingsByAdminId,
  createDefaultSettingsIfNotExists,
  updateSettings,
} from "../models/settingsModel";

import {
  getAdminById,
  getAdminByEmail,
  updateAdmin,
  updateAdminPassword,
} from "../models/adminModel";

const getAdminId = (req: Request): number | undefined => {
  return (req as Request & { adminId?: number }).adminId;
};

/**
 * GET /api/settings
 */
export const getAdminSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const adminId = getAdminId(req);

    if (!adminId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const settings = await createDefaultSettingsIfNotExists(adminId);

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Get admin settings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get admin settings",
    });
  }
};

/**
 * PUT /api/settings
 * Update website preferences
 */
export const updateAdminSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const adminId = getAdminId(req);

    if (!adminId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const {
      maintenance_mode,
      show_job_openings,
      show_mentorship_programs,
      email_notifications,
      application_notifications,
      mentorship_notifications,
      job_notifications,
    
    } = req.body;

    const booleanFields = [
      "maintenance_mode",
      "show_job_openings",
      "show_mentorship_programs",
      "email_notifications",
      "application_notifications",
      "mentorship_notifications",
      "job_notifications",
     
    ];

    for (const field of booleanFields) {
      const value = req.body[field];

      if (value !== undefined && typeof value !== "boolean") {
        res.status(400).json({
          success: false,
          message: `${field} must be true or false`,
        });
        return;
      }
    }

   

    await createDefaultSettingsIfNotExists(adminId);

    await updateSettings(adminId, {
      maintenance_mode,
      show_job_openings,
      show_mentorship_programs,
      email_notifications,
      application_notifications,
      mentorship_notifications,
      job_notifications,
   
    });

    const settings = await getSettingsByAdminId(adminId);

    res.status(200).json({
      success: true,
      message: "Website preferences updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Update admin settings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update website preferences",
    });
  }
};

/**
 * PUT /api/settings/profile
 * Update current admin name and email
 */
export const updateAdminProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const adminId = getAdminId(req);

    if (!adminId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const name =
      typeof req.body.name === "string"
        ? req.body.name.trim()
        : "";

    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";

    if (!name || !email) {
      res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
      return;
    }

    const existingAdmin = await getAdminByEmail(email);

    if (existingAdmin && existingAdmin.id !== adminId) {
      res.status(409).json({
        success: false,
        message: "This email address is already in use",
      });
      return;
    }

    const updated = await updateAdmin(adminId, {
      name,
      email,
    });

    if (!updated) {
      const currentAdmin = await getAdminById(adminId);

      if (!currentAdmin) {
        res.status(404).json({
          success: false,
          message: "Admin not found",
        });
        return;
      }

      if (currentAdmin.name !== name || currentAdmin.email !== email) {
        res.status(400).json({
          success: false,
          message: "Profile could not be updated",
        });
        return;
      }
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
      message: "Profile updated successfully",
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Update admin profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update admin profile",
    });
  }
};

/**
 * PUT /api/settings/password
 * Retained for existing backend compatibility.
 */
export const changeAdminPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const adminId = getAdminId(req);

    if (!adminId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      res.status(400).json({
        success: false,
        message: "All password fields are required",
      });
      return;
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      res.status(400).json({
        success: false,
        message: "New password must contain at least 8 characters",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
      return;
    }

    if (currentPassword === newPassword) {
      res.status(400).json({
        success: false,
        message: "New password must be different from current password",
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

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!passwordMatches) {
      res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updated = await updateAdminPassword(
      adminId,
      hashedPassword
    );

    if (!updated) {
      res.status(400).json({
        success: false,
        message: "Password could not be updated",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change admin password error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};
