import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create an S3 client with credentials from environment variables
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to get the signed URL
export const getSignedUrlHandler = async (req, res) => {
 
  const { key } = req.params; // Extract the video key from the request parameters
  const fullKey = `videos/${key}`; 
  
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fullKey, 
  });
  
  try {
    // Generate a signed URL valid for 1 hour
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    console.log(url,"addgahdg");
    
    res.json({ videoUrl: url }); // Return the signed URL
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ message: 'Error generating signed URL' });
  }
};
