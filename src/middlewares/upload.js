import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { s3 } from "../utils/s3Service.js";

export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "private", // if you want signed URL access only
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const filename = `uploads/${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${path.extname(file.originalname)}`;
      cb(null, filename);
    },
  }),
});
