import jwt from 'jsonwebtoken';

const generateTokens = (res, userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15m',  
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '30d', 
  });

  res.cookie('jwt', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'lax', 
    maxAge: 15 * 60 * 1000, 
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'lax', 
    maxAge: 30 * 24 * 60 * 60 * 1000, 
  });
};

export default generateTokens;
