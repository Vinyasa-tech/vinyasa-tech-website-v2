import "dotenv/config";

import path from "path";
import express from "express";
import cors from "cors";

import pool from "./config/database";

import authRoutes from "./routes/authRoutes";
import candidateAuthRoutes from "./routes/candidateAuthRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import jobOpeningRoutes from "./routes/jobOpeningRoutes";
import jobApplicationRoutes from "./routes/jobApplicationRoutes";
import mentorshipProgramRoutes from "./routes/mentorshipProgramRoutes";
import mentorshipApplicationRoutes from "./routes/mentorshipApplicationRoutes";
import successStoryRoutes from "./routes/successStoryRoutes";
import settingsRoutes from "./routes/settingsRoutes";
import projectRoutes from "./routes/projectRoutes";

import { errorMiddleware } from "./middleware/errorMiddleware";
import { verifyMailer } from "./config/mailer";

const app = express();

const PORT = Number(process.env.PORT) || 5000;

/* ================================
   STATIC FILES
================================ */

app.use(
  "/uploads",
  express.static(path.resolve(process.cwd(), "uploads"))
);

// Company assets
app.use(
  "/assets",
  express.static(path.resolve(process.cwd(), "assets"))
);
/* ================================
   MIDDLEWARE
================================ */

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

/* ================================
   BASIC ROUTE
================================ */

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Vinyasa Backend is running",
  });
});

/* ================================
   DATABASE TEST
================================ */

app.get("/api/db-test", async (_req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();

    await connection.ping();

    res.status(200).json({
      success: true,
      message: "MySQL database connected successfully",
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      success: false,
      message: "MySQL database connection failed",
    });
  } finally {
    connection?.release();
  }
});

/* ================================
   MENTORSHIP API TEST
================================ */

app.get("/api/mentorship-applications-test", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Mentorship applications route is mounted",
    endpoint: "/api/mentorship-applications",
  });
});

/* ================================
   API ROUTES
================================ */

// Authentication
app.use("/api/auth", authRoutes);

app.use("/api/candidate-auth", candidateAuthRoutes);

// Dashboard
app.use("/api/dashboard", dashboardRoutes);

// Careers
app.use("/api/job-openings", jobOpeningRoutes);

app.use("/api/job-applications", jobApplicationRoutes);

// Mentorship
app.use("/api/mentorship-programs", mentorshipProgramRoutes);

app.use("/api/mentorship-applications", mentorshipApplicationRoutes);

// Success Stories
app.use("/api/success-stories", successStoryRoutes);

// Settings
app.use("/api/settings", settingsRoutes);

// Projects
app.use("/api/projects", projectRoutes);

/* ================================
   404 HANDLER
================================ */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* ================================
   GLOBAL ERROR HANDLER
================================ */

app.use(errorMiddleware);

/* ================================
   START SERVER
================================ */

const startServer = async (): Promise<void> => {
  let connection;

  // Check MySQL connection
  try {
    connection = await pool.getConnection();

    await connection.ping();

    console.log("MySQL database connected successfully");
  } catch (error) {
    console.error(
      "Failed to connect to MySQL database:",
      error
    );

    process.exit(1);

    return;
  } finally {
    connection?.release();
  }

  // Verify Gmail SMTP connection
  try {
    await verifyMailer();

    console.log("Careers email service is ready");
  } catch (error) {
    console.error(
      "Careers email service verification failed:",
      error
    );

    console.warn(
      "Backend will continue running, but application status emails may not work."
    );
  }

  // Start Express server
  app.listen(PORT, () => {
    console.log(
      `Vinyasa Backend running on http://localhost:${PORT}`
    );

    console.log(
      "Careers API: http://localhost:" + PORT + "/api/job-applications"
    );
  });
};

void startServer();
