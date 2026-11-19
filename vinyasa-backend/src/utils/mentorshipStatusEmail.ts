
import { mailer, emailFrom } from "../config/mailer";
import fs from "fs";
import path from "path";

export type MentorshipEmailStatus =
  | "pending"
  | "approved"
  | "rejected";

interface ApplicationEmailDetails {
  first_name: string;
  last_name?: string | null;
  email: string;
  program_title?: string | null;
}

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });

export const sendMentorshipStatusEmail = async (
  application: ApplicationEmailDetails,
  status: MentorshipEmailStatus
): Promise<void> => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("Gmail SMTP credentials are not configured.");
  }

  if (!application.email?.trim()) {
    throw new Error("Candidate email address is missing.");
  }

  // Read company logo from Backend/assets
  const logoPath = path.resolve(
    process.cwd(),
    "assets",
    "vinyasa-logo.png"
  );

  if (!fs.existsSync(logoPath)) {
    throw new Error(`Company logo not found: ${logoPath}`);
  }

  const name = [
    application.first_name,
    application.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  const program =
    application.program_title || "our mentorship program";

  const meetingTime =
    process.env.MENTORSHIP_FACE_TO_FACE_TIME ||
    "the time shared by our team";

  let subject = "";
  let heading = "";
  let message = "";
  let extraMessage = "";

  switch (status) {
    case "pending":
      subject = "Update on Your Vinyasa Tech Mentorship Application";
      heading = "Your Application Is Under Review";
      message =
        "Thank you for applying. We have received your mentorship application and our team is currently reviewing it. We will contact you when there is an update.";
      break;

    case "approved":
      subject =
        "Congratulations! Your Vinyasa Tech Mentorship Application Has Been Approved";
      heading = "Congratulations! Your Application Is Approved";
      message =
        "We are pleased to inform you that your application has been approved. Our team will contact you regarding the next steps of your mentorship program.";

      extraMessage = `
        <div style="margin-top:20px;padding:16px;background:#F5F3FB;border-left:4px solid #3F3A8F;border-radius:6px;">
          <h3 style="margin:0 0 10px;color:#302A78;font-size:16px;">
            In-Person Meeting Details
          </h3>
          <p style="margin:0;color:#444;line-height:1.7;">
            Please meet our team this week, Monday to Friday, between
            <strong>${escapeHtml(meetingTime)}</strong>
            to discuss the next steps of your mentorship program.
            Kindly contact us in advance to confirm your visit.
          </p>
        </div>
      `;
      break;

    case "rejected":
      subject =
        "Update Regarding Your Vinyasa Tech Mentorship Application";
      heading = "Application Status Update";
      message =
        "Thank you for your interest in our mentorship program and for taking the time to apply. After reviewing your application, we are unable to move forward with it at this time. We appreciate your interest in Vinyasa Tech and encourage you to explore future opportunities.";
      break;
  }

  const safeName = escapeHtml(name);
  const safeProgram = escapeHtml(program);
  const safeHeading = escapeHtml(heading);
  const safeMessage = escapeHtml(message);

  await mailer.sendMail({
    from: emailFrom,
    to: application.email.trim(),
    subject,

    text: `Hello ${name},

${message}

Program: ${program}

${
  status === "approved"
    ? `In-Person Meeting Details: Please meet our team this week, Monday to Friday, between ${meetingTime}. Kindly contact us in advance to confirm your visit.\n\n`
    : ""
}
Regards,
Vinyasa Tech`,

    // Inline logo. It will not appear as a normal attachment.
    attachments: [
      {
        filename: "vinyasa-logo.png",
        path: logoPath,
        cid: "vinyasa-company-logo",
        contentDisposition: "inline",
      },
    ],

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
              src="cid:vinyasa-company-logo"
              alt="Vinyasa Tech"
              width="240"
              style="
                display:block;
                width:240px;
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

            <p style="color:#333;line-height:1.7;">
              Hello ${safeName},
            </p>

            <p style="color:#555;line-height:1.8;">
              ${safeMessage}
            </p>

            <!-- PROGRAM DETAILS -->

            <div style="
              margin:20px 0;
              padding:15px;
              background:#F5F3FB;
              border-radius:8px;
            ">
              <p style="
                margin:0 0 6px;
                color:#777;
                font-size:12px;
              ">
                SELECTED MENTORSHIP PROGRAM
              </p>

              <p style="
                margin:0;
                color:#302A78;
                font-weight:bold;
              ">
                ${safeProgram}
              </p>
            </div>

            ${extraMessage}

            <!-- SIGNATURE -->

            <p style="
              margin-top:28px;
              color:#555;
              line-height:1.7;
            ">
              Regards,<br />
              <strong style="color:#3F3A8F;">
                Vinyasa Tech
              </strong>
            </p>

          </div>

          <!-- FOOTER -->

          <div style="
            padding:14px 20px;
            background:#F5F3FB;
            text-align:center;
          ">
            <p style="
              margin:0;
              color:#777;
              font-size:11px;
              line-height:1.6;
            ">
              This is an automated notification from Vinyasa Tech.
              Please do not reply directly to this email.
            </p>
          </div>

        </div>
      </div>
    `,
  });

  console.log(
    `Mentorship status email sent to ${application.email} (${status}).`
  );
};
