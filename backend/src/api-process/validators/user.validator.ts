import { body, query } from 'express-validator';
export const linkAccountValidationRule = [
  body('access_token')
  .notEmpty().withMessage('Access token is required').bail(),
  body('id_token')
  .notEmpty().withMessage('Id token is required').bail(),
  body('refresh_token')
  .notEmpty().withMessage('Refresh token is required').bail(),
  body('provider')
  .notEmpty().withMessage('Provider is required').bail(),
  body('email')
  .notEmpty().withMessage('Email is required').bail(),
  body('password')
  .notEmpty().withMessage('Password is required').bail(),
  body('imap_host')
  .notEmpty().withMessage('IMAP host is required').bail(),
  body('imap_port')
  .notEmpty().withMessage('IMAP port is required').bail(),  
  body('smtp_host')
  .notEmpty().withMessage('SMTP host is required').bail(),  
  body('smtp_port')
  .notEmpty().withMessage('SMTP host is required').bail(),      
];
export const updateProfileValidationRules = [
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
    .withMessage('Please provide a valid E.164 phone number (e.g., +1234567890)').bail() 
];
export const updateEmailAccountsPriorityValidationRules = [
  body('updates')
    .isArray({min:1})
    .withMessage('updates must be an array with at least 1 element').bail(),     
  body('updates.*.id')
    .notEmpty().withMessage('id is required').bail()
    .isUUID().withMessage('id should be a valid UUID').bail(),    
  body('updates.*.priority')
    .notEmpty().withMessage('priority is required').bail() 
    .isInt({min:0,max:100}).withMessage('priority needs to be an integer b/w 0 and 100').bail()
    .toInt(),
];
export const getServiceStatsValidationRules = [
  query("to").optional()
  .isISO8601().withMessage('Invalid date format').bail(),
  query("from").optional()
  .isISO8601().withMessage('Invalid date format').bail()
]