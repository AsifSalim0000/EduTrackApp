import Otp from '../domain/Otp.js';
import asyncHandler from 'express-async-handler';

const getOtpFromDatabase = asyncHandler(async (otp) => {
  return await Otp.findOne({ otp });
});

const verifyOtpInDatabase = asyncHandler(async (otp) => {
  return await Otp.updateOne({ otp }, { $set: { isValid: false } });
});

export { getOtpFromDatabase, verifyOtpInDatabase };
