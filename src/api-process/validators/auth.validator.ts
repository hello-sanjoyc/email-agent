import { body } from 'express-validator';

export const loginValidationRules = [
  body('email')
  .notEmpty().withMessage('Email is required').bail()
  .isEmail().withMessage('Email must be a valid email address').bail()
  .normalizeEmail({ gmail_remove_dots: false }),
  
  body('password')
  .notEmpty().withMessage('Password is required').bail()
  .isString().withMessage('Password must be a string').bail(),  
];

export const refreshValidationRules = [
  body('refreshToken')
  .notEmpty().withMessage('refresh token is required').bail()
  .isString().withMessage('refresh token is required').bail(),
];

export const logoutValidationRules = [
  body('refreshToken').isString().withMessage('refreshToken is required').bail(),
];
export const registerValidationRules = [
  body('name')
    .isString()
    .withMessage('name must be a string').bail()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters').bail(),
    
  body('email')
    .notEmpty().withMessage('email is required').bail()
    .isEmail().withMessage('Please provide a valid email address').bail()
    .normalizeEmail({ gmail_remove_dots: false }),    
    
  body('phone')
    .optional({values:'falsy'})    
    .matches(/^\+[1-9]\d{6,14}$/)
    .withMessage('Please provide a valid E.164 phone number (e.g., +1234567890)').bail(),
    
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long').bail()
    .matches(/\d/)
    .withMessage('Password must contain at least one number').bail()
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter').bail(),

  body('retype_password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long').bail()
    .matches(/\d/)
    .withMessage('Password must contain at least one number').bail()
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter').bail(),
];

export const sendPassResetMailValidationRules = [
  body('email')
  .notEmpty().withMessage('email is required').bail()
  .isEmail().withMessage('Please enter proper email').bail(),
];
export const resetPasswordValidationRules = [
  body('token')
  .notEmpty().withMessage('token is missing').bail(),
  body('userId')
  .notEmpty().withMessage('user ID is missing').bail()
  .isUUID().withMessage('user ID must be a UUID').bail(),
 body('newPassword')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long').bail()
  .matches(/\d/)
  .withMessage('Password must contain at least one number').bail()
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter').bail(),
];