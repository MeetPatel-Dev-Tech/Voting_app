import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

export const uploadImageToS3 = async (file) => {
  const fileStream = fs.createReadStream(file.path);

  const key = `uploads/${Date.now()}-${uuidv4()}${path.extname(
    file.originalname
  )}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: fileStream,
    ContentType: file.mimetype,
  };

  await s3.upload(params).promise();
  return key;
};

export const getSignedUrlFromKey = (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Expires: 7 * 24 * 60 * 60, // 7 days
  };
  return s3.getSignedUrl("getObject", params);
};
