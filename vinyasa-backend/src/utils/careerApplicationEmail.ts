
import { mailer, emailFrom } from "../config/mailer";
import fs from "fs";
import path from "path";

export type CareerEmailStatus =
  | "new"
  | "reviewing"
  | "shortlisted"
  | "rejected"
  | "hired";

interface CareerApplicationEmailDetails {
  first_name: string;
  last_name?: string | null;
  email: string;
  job_title?: string | null;
}

interface EmailTemplate {
  subject: string;
  heading: string;
  message: string;
}

// Escape HTML to prevent unsafe content
const escapeHtml = (value: string): string => {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
};

// Get email content according to application status
const getEmailTemplate = (
  status: CareerEmailStatus
): EmailTemplate => {
  switch (status) {
    case "new":
      return {
        subject:
          "Your Vinyasa Tech Job Application Has Been Received",
        heading: "Application Received",
        message:
          "Thank you for applying to Vinyasa Tech. We have successfully received your application. Our recruitment team will review your details and contact you when there is an update.",
      };

    case "reviewing":
      return {
        subject:
          "Your Vinyasa Tech Application Is Under Review",
        heading: "Application Under Review",
        message:
          "Your application is currently under review by our recruitment team. We appreciate your interest in Vinyasa Tech and will keep you informed about any further updates.",
      };

    case "shortlisted":
      return {
        subject:
          "Congratulations! You Have Been Shortlisted – Vinyasa Tech",
        heading:
          "Congratulations! You Have Been Shortlisted",
        message:
          "We are pleased to inform you that you have been shortlisted for the next stage of our recruitment process. Our team will contact you with further details.",
      };

    case "rejected":
      return {
        subject:
          "Update Regarding Your Vinyasa Tech Job Application",
        heading: "Application Status Update",
        message:
          "Thank you for your interest in joining Vinyasa Tech. After carefully reviewing your application, we are unable to move forward with your candidature at this time. We appreciate your time and encourage you to apply for future opportunities.",
      };

    case "hired":
      return {
        subject:
          "Congratulations! You Have Been Selected – Vinyasa Tech",
        heading:
          "Congratulations! You Have Been Selected",
        message:
          "We are pleased to inform you that you have been selected for the position. Our team will contact you regarding the next steps and joining formalities. We look forward to welcoming you to Vinyasa Tech.",
      };

    default: {
      const exhaustiveCheck: never = status;

      throw new Error(
        `Unsupported career email status: ${exhaustiveCheck}`
      );
    }
  }
};

// Send career application status email
export const sendCareerApplicationStatusEmail = async (
  application: CareerApplicationEmailDetails,
  status: CareerEmailStatus
): Promise<void> => {

  // Check SMTP credentials
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error(
      "Gmail SMTP credentials are not configured."
    );
  }

  // Check candidate email
  if (!application.email?.trim()) {
    throw new Error(
      "Candidate email address is missing."
    );
  }

  // Get company logo path
  const logoPath = path.resolve(
    process.cwd(),
    "assets",
    "vinyasa-logo.png"
  );

  // Check whether logo exists
  if (!fs.existsSync(logoPath)) {
    throw new Error(
      `Company logo not found at: ${logoPath}`
    );
  }

  // Candidate name
  const name = [
    application.first_name,
    application.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  // Job title
  const jobTitle =
    application.job_title ||
    "the position you applied for";

  // Get email template
  const template = getEmailTemplate(status);

  // Escape dynamic HTML values
  const safeName = escapeHtml(name);
  const safeJobTitle = escapeHtml(jobTitle);
  const safeHeading = escapeHtml(template.heading);
  const safeMessage = escapeHtml(template.message);

  // Send email
  await mailer.sendMail({
    from: emailFrom,
    to: application.email.trim(),
    subject: template.subject,

    // Inline company logo attachment
    attachments: [
      {
        filename: "vinyasa-logo.png",
        path: logoPath,
        cid: "vinyasa-logo",
        contentType: "image/png",
        contentDisposition: "inline",
      },
    ],

    // Plain text version
    text: `Hello ${name},

${template.message}

Position: ${jobTitle}

Regards,
Vinyasa Tech`,

    // HTML email template
    html: `
      <div style="
        margin:0;
        padding:30px 12px;
        background:#F5F3FB;
        font-family:Arial,sans-serif;
      ">

        <div style="
          max-width:600px;
          margin:auto;
          background:#ffffff;
          border-radius:12px;
          overflow:hidden;
        ">

          <!-- COMPANY HEADER -->

          <div style="
            padding:24px;
            background:#3F3A8F;
            text-align:left;
          ">

            <img
              src="cid:vinyasa-logo"
              alt="Vinyasa Tech Logo"
              width="160"
              style="
                display:block;
                width:160px;
                max-width:100%;
                height:auto;
                margin:0;
                border:0;
              "
            />

          </div>

          <!-- EMAIL CONTENT -->

          <div style="padding:28px 24px;">

            <h2 style="
              margin:0 0 18px;
              color:#302A78;
              font-size:21px;
            ">
              ${safeHeading}
            </h2>

            <p style="
              color:#333333;
              line-height:1.7;
            ">
              Hello ${safeName},
            </p>

            <p style="
              color:#555555;
              line-height:1.8;
            ">
              ${safeMessage}
            </p>

            <!-- JOB POSITION -->

            <div style="
              margin:20px 0;
              padding:15px;
              background:#F5F3FB;
              border-radius:8px;
            ">

              <p style="
                margin:0 0 6px;
                color:#777777;
                font-size:12px;
              ">
                APPLIED POSITION
              </p>

              <p style="
                margin:0;
                color:#302A78;
                font-weight:bold;
              ">
                ${safeJobTitle}
              </p>

            </div>

            <!-- SIGNATURE -->

            <p style="
              margin-top:28px;
              color:#555555;
              line-height:1.7;
            ">
              Regards,<br />

              <strong style="color:#3F3A8F;">
                Vinyasa Tech
              </strong>
            </p>

          </div>

          <!-- EMAIL FOOTER -->

          <div style="
            padding:14px 20px;
            background:#F5F3FB;
            text-align:center;
          ">

            <p style="
              margin:0;
              color:#777777;
              font-size:11px;
              line-height:1.6;
            ">
              This is an automated email notification from
              Vinyasa Tech. Please do not reply directly
              to this email.
            </p>

          </div>

        </div>

      </div>
    `,
  });

  console.log(
    `Career status email sent to ${application.email} (${status}).`
  );
};
