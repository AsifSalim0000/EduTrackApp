import multer from 'multer';
import path from 'path';

// Configure Multer storage for videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'frontend/src/assets/uploads/videos/'); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, 'video-' + uniqueSuffix + fileExtension);
  }
});

const videoUpload = multer({
    storage: videoStorage,
    limits: { fileSize: 1024 * 1024 * 500 }, 
    fileFilter: (req, file, cb) => {
      const allowedTypes = /mp4|mkv|avi|mov/; 
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
  
      if (extname && mimetype) {
        cb(null, true);
      } else {
        cb(new Error('Only video files are allowed'));
      }
    }
  });
  

export default videoUpload;
