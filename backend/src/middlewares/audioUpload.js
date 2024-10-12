import { S3Client } from '@aws-sdk/client-s3'; 
import multer from 'multer';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();

// Initialize S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


const audioUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    key: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + path.extname(file.originalname);
      cb(null, `audio/${uniqueSuffix}`); 
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'audio/wav' || file.mimetype === 'audio/mp3') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only audio files are allowed!'), false);
    }
  },
});

export default audioUpload;