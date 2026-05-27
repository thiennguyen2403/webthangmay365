import multer from "multer";
import path from "path";
import fs from "fs";

const makeStorage = (folder) => multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `uploads/${folder}`;
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

export const uploadContract = multer({ storage: makeStorage("contracts") });
export const uploadReportImage = multer({ storage: makeStorage("reports") });
