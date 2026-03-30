import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.utils.js";
import AppError from "../utils/appError.utils.js";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    //authorization header collect from request object
    const authHeader = req.headers.authorization;
    //checking of auth header if it contains Bearer or not
    if (!authHeader || !authHeader.startsWith("Bearer "))throw new AppError("Unauthorized: Missing token", 401);
    //getting the actual token out by splitting the Bearer word out
    const token = authHeader.split(" ")[1];
    //cehchking token's presence
    if(!token){
      throw new AppError("User authentication failed",401)
    } 
    //verifying token
    const payload = verifyAccessToken(token);
    //populating the user object in request object
    req.user = {
      id: payload.userId,      
      email:payload.userEmail,
      phone:payload.userPhone
    };
    //moving on to next middleware
    next();
  } catch (err) {
    //throwing error to the global error handling middleware
    next(err);
  }
};