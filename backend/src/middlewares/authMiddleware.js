import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../domain/User.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  if (req.cookies.jwt) {

    token = req.cookies.jwt;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
   
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.userId).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});


const admin = asyncHandler(async(req, res, next) => {
  let token;

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.userId).select('-password');
   
      
      if (req.user && req.user.isAdmin) {
        
        next();
      } else { 
        res.status(403);
        throw new Error('Not authorized as an admin');
      }
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export { protect, admin };
