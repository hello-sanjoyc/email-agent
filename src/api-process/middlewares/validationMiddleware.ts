import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import fs from 'fs'
import { logger } from '../../config/logger.js';

// Middleware to check validation results
export const checkRouteValidity = (req: Request, res: Response, next: NextFunction): void | object => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        //file unlinking if present as part of the req.files object
        if(req.files){
            (req.files as Express.Multer.File[]).forEach((file)=>{
                fs.unlink(file.path,(err)=>{
                    if(err){
                      logger.error(err);
                    }
                });
            });           
        }
        // const messages: string[] = [];
        // validationErrors.array().forEach((err: any) => {  
        //     messages.push(err.msg); 
        // });
        const response = {
            error: true,
            code: 'VALIDATION_ERROR',
            message: validationErrors.array()[0].msg || 'validation failed'  //messages.join(', ')  // Combine all messages into one string
        };
        return res.status(422).json(response);  
    } else {
        next();
    }
};