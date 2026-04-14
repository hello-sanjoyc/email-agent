import bcrypt from 'bcrypt';
import crypto from 'crypto';
import db from '../../db/index.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.utils.js';
import env from '../../config/env.js';
import AppError from '../utils/appError.utils.js';
import { NewCreatedUserWithAccount, UserCreateDataset } from './types.js';
import { logger } from '../../config/logger.js';
import { IssuedPassResetTokenData, UserDataByEmail } from './types.js';
/**
 * Hash refresh token for storage & comparison.
 * simple sha256 hex.
 */
const hashToken = (token: string) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
export const isEmailUsed = async (email:string):Promise<boolean> => {
  logger.info('checking if the email is used',{email});
  try{          
    const recordByEmail = await db.user.findFirst({where:{email}});       
    if(recordByEmail){
      if(recordByEmail.isActive === false){
        await db.user.update({
          where:{id:recordByEmail.id},
          data:{isActive:true}
        });
        throw new AppError("Your deactivated account activated successfully. Please try to login now",400);
      }
      logger.warn('email already used',{email});
      return true;
    }   
    logger.info('email is brand new to this system',{email});       
    return false;
  }catch(err){
    throw err;
  }
}

export const createUser = async (name:string,email:string,phone:string|undefined,password:string):Promise<NewCreatedUserWithAccount>=>{
  logger.info('creating user',{email,phone});
  try{
    const trialStartDate = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialStartDate.getDate() + 7);
    const hashedPassword = await bcrypt.hash(password,10); 
    const newUser = await db.$transaction(async (tx)=>{
      const newUser = await tx.user.create({
        data:{
          name,
          email,
          password:hashedPassword,
          phone:phone ?? null,
          aiServiceName: "groq" // I am setting default service name as groq due to its rate limiting facility in testing mode, can change it later        
        },
        select:{
          id:true,
          name:true,
          email:true,
          phone:true,
          createdAt:true
        }
      });
      //find trial plan
      const trialPlan = await tx.subscriptionPlan.findFirst({
        where:{
          billingInterval:"TRIAL"          
        }
      });
      if(!trialPlan) throw new AppError("Invalid trial plan",400);
      await tx.subscription.create({
        data:{
          userId:newUser.id,
          planId:trialPlan.id,          
          currentUsageCount:0,
          startDate:trialStartDate,
          endDate:trialEndDate,
          isActive:true
        }
      });
      return newUser;
    });  
    logger.info('user created and trial plan added',{email,phone});
    return newUser;
  }catch(err){
    throw err;
  }
}
export const login = async (email: string, password: string) => {
  logger.info('logging in',{email});
  const user = await db.user.findUnique(
    {
      where: { email },
      select:{
        id:true,
        name:true,        
        password:true,
        isActive:true,
        email:true,
        phone:true
      }      
    }
  ); 
  if (!user){
    logger.warn('user not found',{email});
    throw new AppError('User not found for the provided email',400);  
  } 

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    logger.warn('password mismatch',{email});
    throw new AppError('Email or password did not match',400);
  } 

  if (!user.isActive){
    logger.warn('user is inactive',{email});
    throw new AppError('User is inactive',400);
  } 
  const accessToken = signAccessToken({ userId: user.id,userEmail:user.email,userPhone:user.phone });
  const refreshToken = signRefreshToken({ userId: user.id,userEmail:user.email,userPhone:user.phone });
  const hashed = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + parseDuration(env.JWT_REFRESH_EXPIRE_TIME || '7d'));

  // Upsert: remove existing tokens for same user + device? here we create a new record
  await db.refreshToken.create({
    data:{
      userId: user.id,
      token: hashed,
      expiresAt: expiresAt,
      userAgent: '',
      ipAddress: '',
      isRevoked: false,
    }
  });
  logger.info('tokens issued',{email});      
  return {
    user: { id: user.id, name: user.name, email: user.email},
    accessToken,
    refreshToken,
    expiresIn: env.JWT_EXPIRATION_TIME 
  };
};

export const refresh = async (rawRefreshToken: string) => {
  logger.info('refreshing login');
  try{
    const payload = verifyRefreshToken(rawRefreshToken);
    const hashed = hashToken(rawRefreshToken);
    const tokenRow = await db.refreshToken.findFirst({
      where: { token: hashed, isRevoked: false },
    });

    if (!tokenRow){
      logger.warn('invalid refresh token');
      throw new AppError('Invalid refresh token',401);
    } 

    // optional: check expiry
    if (tokenRow.expiresAt && tokenRow.expiresAt < new Date()) {
      logger.warn('expired refresh token');
      throw new AppError('Refresh token expired',400);
    }

    // issue new tokens (rotation)
    const user = await db.user.findUnique({
      where:{id:payload.userId},
      select:{
          id:true,
          email:true,
          phone:true,
          name:true
      }
    });
    if (!user){
      logger.warn('user not found');
      throw new AppError('User not found',404);
    } 

    const accessToken = signAccessToken({ userId:user.id,userEmail:user.email,userPhone:user.phone});
    const newRefreshToken = signRefreshToken({ userId:user.id,userEmail:user.email,userPhone:user.phone });
    const newHashed = hashToken(newRefreshToken);
    const newExpiresAt = new Date(Date.now() + parseDuration(env.JWT_REFRESH_EXPIRE_TIME || '7d'));
    await db.$transaction([
      // mark old token revoked and store new token (rotate)
      db.refreshToken.update({
          where:{id:tokenRow.id},
          data:{isRevoked:true}
      }),
      db.refreshToken.create({
          data:{
          userId: user.id,
          token: newHashed,
          expiresAt: newExpiresAt,
          isRevoked: false,
      }
      })
    ]);  
    logger.info('tokens issued');
    return {
      user: { id: user.id, name: user.name, email: user.email, phone:user.phone },
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: env.JWT_EXPIRATION_TIME || '1h',
    };
  }catch(err){
    throw err;
  }  
};

export const logout = async (rawRefreshToken: string) => {
  try{    
    const hashed = hashToken(rawRefreshToken);
    const tokenRow = await db.refreshToken.findFirst({ where: { token: hashed } });
    if (!tokenRow){
      logger.warn('invalid refresh token');
      throw new AppError('Invalid refresh token',400);
    } 
    await db.refreshToken.update({
      where:{id:tokenRow.id},
      data:{isRevoked:true}
    });
    logger.info('logout successful');  
    return true; 
  }catch(err){
    throw err;
  }  
};

export const issuePassResetToken = async (userData:UserDataByEmail):Promise<IssuedPassResetTokenData> => {
  try{
    await db.passResetToken.deleteMany({
      where:{userId:userData.id}
    });
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex'); 
    const newTokenData = await db.passResetToken.create({
      data:{
        userId:userData.id,
        token:hashedToken,
        expiresAt:  new Date(Date.now() + 15 * 60 * 1000)
      },
      select:{
        id:true,
        userId:true,
        token:true,
        expiresAt:true
      }
    });
    return {
      rawToken,
      otherData:newTokenData
    }
  }catch(err){
    throw err;
  }
}
export const constructPassResetLink = (userId:string,token:string):string => {
  try{
    const urlObject = new URL(env.PASS_RESET_URL);
    urlObject.searchParams.set('userId',userId);
    urlObject.searchParams.set('token',token);
    return urlObject.toString();
  }catch(err){
    throw err;
  }
}
export const checkPassResetTokenValidity = async (userId:string,token:string):Promise<boolean>=>{
  try{
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const passTokenEntry = await db.passResetToken.findFirst({
      where:{userId,token:tokenHash}
    });
    if(!passTokenEntry) throw new AppError('Invalid credentials',400);
    if(passTokenEntry.expiresAt < new Date()) throw new AppError('Invalid session',400);
    return true;
  }catch(err){
    throw err;
  }
}
export const isOldPasswordNewPassword = async (userId:string,newPassword:string):Promise<boolean> => {
  try{
    const userData = await db.user.findFirst({
      where:{id:userId}
    });
    if(!userData) throw new AppError('No valid user found',404);
    const isPasswordSameAsOld = await bcrypt.compare(newPassword,userData.password);
    return !isPasswordSameAsOld;
  }catch(err){
    throw err;
  }
}
export const changePassword = async (id:string,password:string) => {
  try{
    const hashedPassword = await bcrypt.hash(password,10);
    await db.user.update({
      where:{id},
      data:{password:hashedPassword}
    });
  }catch(err){
    throw err;
  }
}
const parseDuration = (str: string) => {
  // '7d', '15m', '12h', '3600s' supported
  if (str.endsWith('d')) return Number(str.slice(0, -1)) * 24 * 60 * 60 * 1000;
  if (str.endsWith('h')) return Number(str.slice(0, -1)) * 60 * 60 * 1000;
  if (str.endsWith('m')) return Number(str.slice(0, -1)) * 60 * 1000;
  if (str.endsWith('s')) return Number(str.slice(0, -1)) * 1000;
  // default 7 days
  return 7 * 24 * 60 * 60 * 1000;
};
