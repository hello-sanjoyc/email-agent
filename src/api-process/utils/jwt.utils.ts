import jwt from 'jsonwebtoken';
import env from '../../config/env.js';
import AppError from './appError.utils.js';

export interface AccessTokenPayload {
  userId:string;
  userEmail:string;
  userPhone:string|null;
  iat?: number;
  exp?: number;
}
export interface RefreshTokenPayload {
    userId:string;
    userEmail:string;
    userPhone:string|null;
    iat?: number;
    exp?: number;
}

export const signAccessToken = (payload: AccessTokenPayload) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRATION_TIME || '15m' } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string) => {
  try{
    return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
  }catch(err){
    throw new AppError('Invalid or expired token',401);
  }  
};

export const signRefreshToken = (payload: RefreshTokenPayload) => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRE_TIME || '7d' } as jwt.SignOptions);
};

export const verifyRefreshToken = (token: string) => {
  try{
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  }catch(err){
    throw new AppError('Invalid or expired token',401);
  }  
};