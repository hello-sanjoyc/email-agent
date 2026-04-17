import { Router } from 'express';
import { getProfile, getUserAccounts, linkAccount,getUserCalendarAccounts,linkCalendarAccount, toggleAccountStatus, toggleCalendarAccountStatus,getServiceStats,updateProfile, getAIResponseTones, changeAIResponseTone, toggleAutomationStatus, updateEmailAccountsPriority, deleteEmailAccount, deleteCalendarAccount, getAIServices, changeAIService, getActionItems, toggleIsSeenOfActionItem, deactivateProfile, updateEmailAccount, getEmailActivity, getEmailActions } from '../../controllers/v1/user.controller.js';
import { authenticate } from '../../middlewares/authentication.js';
import { getServiceStatsValidationRules, updateEmailAccountsPriorityValidationRules, updateEmailAccountValidationRules } from '../../validators/user.validator.js';
import { checkRouteValidity } from '../../middlewares/validationMiddleware.js';
// import { linkAccountValidationRule } from '../../validators/user.validator.js';
// import { checkRouteValidity } from '../../middlewares/validationMiddleware.js';

//TODO:the express validation is left out for now, REMEMBER TO ADD IT!
const userRouter = Router();
//to get all the linked email accounts in the logged in user's name
userRouter.get('/linked-accounts',authenticate,getUserAccounts);
//to link an email account in the logged in user's name
userRouter.post('/link-account',authenticate,linkAccount);
//to toggle an email account's status between active and inactive for a logged in user
userRouter.put('/toggle-account-status/:id',authenticate,toggleAccountStatus);
//to get all the linked calendar accounts for a logged in user
userRouter.get('/linked-calendar-accounts',authenticate,getUserCalendarAccounts);
//to link a calendar account for a logged in user
userRouter.post('/link-calendar-account',authenticate,linkCalendarAccount);
//to toggle an email account's status between active and inactive for a logged in user
userRouter.put('/toggle-calendar-account-status/:id',authenticate,toggleCalendarAccountStatus);
//to get the profile details of a logged in user
userRouter.get('/profile',authenticate,getProfile);
//editing profile data for a logged in user
userRouter.put('/profile',authenticate,updateProfile);
//dashboard data for a user
userRouter.get('/service-stats',authenticate,getServiceStatsValidationRules,checkRouteValidity,getServiceStats);
//get AI response tones
userRouter.get('/ai-response-tones',authenticate,getAIResponseTones);
//change AI response tone
userRouter.put('/ai-response-tone',authenticate,changeAIResponseTone);
//toggle Automation
userRouter.put('/toggle-automation',authenticate,toggleAutomationStatus);
//changing email account priorities
userRouter.put('/update-email-accounts-priority',authenticate,updateEmailAccountsPriorityValidationRules,checkRouteValidity,updateEmailAccountsPriority);
//delete email account
userRouter.delete('/email-account/:id',authenticate,deleteEmailAccount);
//delete email account
userRouter.delete('/calendar-account/:id',authenticate,deleteCalendarAccount);
//get AI services
userRouter.get('/ai-services',authenticate,getAIServices);
//change AI response tone
userRouter.put('/ai-service',authenticate,changeAIService);
//get action items
userRouter.get('/action-items',authenticate,getActionItems);
//toggle is seen of a specific action item
userRouter.put('/action-item/seen/toggle/:id',authenticate,toggleIsSeenOfActionItem);
//deactivate profile
userRouter.post('/profile/deactivate',authenticate,deactivateProfile);
//custom email account update
userRouter.patch('/email-account/:id',authenticate,updateEmailAccountValidationRules,checkRouteValidity,updateEmailAccount);
//fetch email activity data
userRouter.get('/email-activities',authenticate,getEmailActivity);
//fetch email actions 
userRouter.get('/email-actions',authenticate,getEmailActions);
export default userRouter;