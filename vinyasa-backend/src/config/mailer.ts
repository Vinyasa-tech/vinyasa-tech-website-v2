import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST || "://gmail.com";
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpPort = Number(process.env.SMTP_PORT || 465);

if (!smtpUser || !smtpPass) {
  console.warn(
    "SMTP credentials are missing. Email sending is disabled."
  );
}

export const mailer = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth:
    smtpUser && smtpPass
      ? {
          user: smtpUser,
          pass: smtpPass,
        }
      : undefined,
});

export const emailFrom =
  process.env.SMTP_FROM || smtpUser || "Vinyasa Tech";

export const verifyMailer = async (): Promise<void> => {
  if (!smtpUser || !smtpPass) {
    throw new Error(
      "SMTP_USER or SMTP_PASS is missing in Backend/.env"
    );
  }

  await mailer.verify();

  console.log("Gmail SMTP connection verified successfully.");
};