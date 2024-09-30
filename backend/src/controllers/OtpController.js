import asyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';
import User from '../domain/User.js';
import generateToken from '../utils/generateToken.js';
import { verifyForgotOtp, verifyOtp } from '../usecases/VerifyOtp.js';
import { HttpStatus } from '../utils/HttpStatus.js';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: "asifsalim0000@gmail.com",
    pass: 'gugg uwsw dsnv wzjk',
  },
});

const sendOtp = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: 'User Already Exists' });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  req.session.otp = otp;
  req.session.userData = { email, username, password };
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  });
  res.status(HttpStatus.OK).json({ message: 'OTP sent successfully' });
});

const forgotOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(HttpStatus.BAD_REQUEST).json({ error: `User Doesn't Exist` });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  req.session.forgototp = otp;
  req.session.email = email;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code For Resetting Password',
    text: `Your OTP code is ${otp}`,
  });
  res.status(HttpStatus.OK).json({ message: 'OTP sent successfully' });
});

const verifyOtpHandler = asyncHandler(async (req, res) => {
  const result = await verifyOtp(req);
  if (result.success) {
    generateToken(res, result.user.id);
    res.status(HttpStatus.CREATED).json({
      _id: result.user.id,
      username: result.user.username,
      email: result.user.email,
      role: result.user.role,
      title: result.title,
      profileImage: result.profileImage
    });
  } else {
    res.status(HttpStatus.BAD_REQUEST).json({ error: result.error });
  }
});

const verifyForgotOtpHandler = asyncHandler(async (req, res) => {
  const result = await verifyForgotOtp(req);
  if (result.success) {
    res.status(HttpStatus.CREATED).json({
      message: "Password Reset Successfully",
    });
  } else {
    res.status(HttpStatus.BAD_REQUEST).json({ error: result.error });
  }
});

export { sendOtp, verifyOtpHandler, forgotOtp, verifyForgotOtpHandler };
