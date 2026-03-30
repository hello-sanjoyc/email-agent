import type { NextFunction, Request, Response } from 'express';
import * as authService from '../../services/auth.service.js';
import AppError from '../../utils/appError.utils.js';
import { logger } from '../../../config/logger.js';
import { LoginInput, LogoutInput, RefreshTokenInput, RegisterInput, ResetPasswordInput, SendPassResetMailInput } from './types.js';
import { fetchUserByEmail } from '../../services/user.service.js';
import passwordResetTemplate from '../../../mail/templates/passReset.template.js';
import { getEmailSendingQueue } from '../../../queues/emailSendingQueue.js';
import { EmailSendQueuePayload } from '../../../queues/types.js';

//user registration function
export const register = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const input = req.body as RegisterInput;        
        //check mismatch b/w password and retype password
        if(input.password !== input.retype_password) throw new AppError('Password mismatch',400);
        //check of already any user exists with the same email
        const emailOrPhoneUsed = await authService.isEmailUsed(input.email);
        if(emailOrPhoneUsed) throw new AppError('Email or phone is already in use',409);
        await authService.createUser(input.name,input.email,input.phone,input.password);
        const loginData = await authService.login(input.email,input.password);
        return res.status(201).json({
            error:false,
            message:'User created',
            data:loginData
        });
    }catch(err){
        next(err);
    }
}

//user login function
export const login = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const input = req.body as LoginInput;
    const result = await authService.login(input.email, input.password);
    logger.info("after login: payload is: "+JSON.stringify(result));  
    return res.status(200).json({ error: false,message:'Logged in', data: result });
  } catch (err) {
    next(err);
  }
};

//user login refresh function
export const refreshToken = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const input = req.body as RefreshTokenInput; 
    const result = await authService.refresh(input.refreshToken);
    return res.status(200).json({ error: false,message:'Login session refreshed', data: result });
  } catch (err) {
    next(err);
  }
};

//user logout function
export const logout = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const input = req.body as LogoutInput;
    await authService.logout(input.refreshToken);
    return res.status(200).json({ error: false, message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};

//function to send pass reset email if the user forgets the password
export const sendPassResetMail = async (req:Request,res:Response,next:NextFunction) => {
  try{
    const input = req.body as SendPassResetMailInput;
    const userData = await fetchUserByEmail(input.email);
    const tokenData = await authService.issuePassResetToken(userData);
    const link = authService.constructPassResetLink(tokenData.otherData.userId,tokenData.rawToken);
    const queueData:EmailSendQueuePayload = {
        subject:"Password Reset",
        to:userData.email,
        content:passwordResetTemplate(link)
    };
    const emailSendingQueue = getEmailSendingQueue();
    await emailSendingQueue.add('email-sending',queueData);
    return res.status(200).json({
      error:false,
      message:"An email is sent to your email address to reset your password"
    });
  }catch(err){
    next(err);
  }
}

//actual function to reset the password
export const resetPassword = async (req:Request,res:Response,next:NextFunction) => {
  try{
    const input = req.body as ResetPasswordInput;
    //validating the pass reset token
    await authService.checkPassResetTokenValidity(input.userId,input.token);
    //check if old and new passowrd are same
    await authService.isOldPasswordNewPassword(input.userId,input.newPassword);
    //change the password
    await authService.changePassword(input.userId,input.newPassword);
    return res.status(200).json({
      error:false,
      message:"Password changed!"
    });   
  }catch(err){
    next(err);
  }
}