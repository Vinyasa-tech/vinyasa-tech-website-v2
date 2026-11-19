
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ApiApplication } from "../services/careersApi";

export function downloadApplicationPdf(
  application: ApiApplication
): void {
  const pdf = new jsPDF();

  const fullName =
    `${application.first_name ?? ""} ${application.last_name ?? ""}`.trim() ||
    "Not provided";

  const qualifications = application.qualifications ?? [];

  const qualificationNames = qualifications
    .map((item) => item.course)
    .filter(Boolean)
    .join(", ");

  const years = qualifications
    .map((item) => item.year)
    .filter(Boolean)
    .join(", ");

  const colleges = qualifications
    .map((item) => item.collegeName)
    .filter(Boolean)
    .join(", ");

  const technicalSkills = (
    application.technical_skills ?? []
  ).join(", ");

  pdf.setFontSize(18);
  pdf.setTextColor(63, 58, 143);
  pdf.text("Vinyasa Tech", 14, 20);

  pdf.setFontSize(13);
  pdf.setTextColor(40, 40, 40);
  pdf.text("Candidate Application Details", 14, 30);

  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.text(
    `Application ID: ${application.id}`,
    14,
    35
  );

  autoTable(pdf, {
    startY: 42,
    head: [["Field", "Details"]],
    body: [
      ["Full Name", fullName],
      ["Email", application.email || "Not provided"],
      ["Mobile Number", application.phone || "Not provided"],
      ["Experience", application.experience || "Not provided"],
      ["Position", application.job_title || "Not provided"],
      ["Department", application.department || "Not provided"],
      ["Qualification", qualificationNames || "Not provided"],
      ["Year", years || "Not provided"],
      ["College Name", colleges || "Not provided"],
      [
        "Technical Skills",
        technicalSkills || "Not provided",
      ],
      [
        "Application Status",
        application.status || "Not provided",
      ],
      [
        "Applied Date",
        application.applied_at
          ? new Date(application.applied_at).toLocaleDateString(
              "en-IN"
            )
          : "Not provided",
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [63, 58, 143],
      textColor: [255, 255, 255],
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
      overflow: "linebreak",
      valign: "top",
    },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 135 },
    },
    margin: { left: 14, right: 14 },
  });

  const safeName =
    fullName
      .replace(/[^a-z0-9]+/gi, "_")
      .replace(/^_|_$/g, "") || "Candidate";

  pdf.save(`Vinyasa_Application_${safeName}.pdf`);
}
