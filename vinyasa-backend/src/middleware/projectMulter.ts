
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";

const uploadDirectory = path.resolve(
  process.cwd(),
  "uploads",
  "projects",
);

// Create the folder automatically if it does not exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    callback(null, `project-${randomUUID()}${extension}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  callback,
) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return callback(
      new Error("Only JPG, PNG and WEBP images are allowed."),
    );
  }

  callback(null, true);
};

const projectUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

export default projectUpload;
