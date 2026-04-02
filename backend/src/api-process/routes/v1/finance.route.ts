import { Router } from 'express';
import { authenticate } from '../../middlewares/authentication.js';
import { getSubscriptionPlans , getCurrentSubscriptionPlan, createSubscription,verifySubscription, respondToWebhook } from '../../controllers/v1/finance.controller.js';
import { createSubscriptionValidationRules, verifySubscriptionValidationRules } from '../../validators/finance.validator.js';
import { checkRouteValidity } from '../../middlewares/validationMiddleware.js';

//TODO:the express validation is left out for now, REMEMBER TO ADD IT!
const financeRouter = Router();
//get all subscription plans
financeRouter.get('/subscription-plans',authenticate,getSubscriptionPlans);

//get user's current active plan
financeRouter.get('/active-subscription-plan',authenticate,getCurrentSubscriptionPlan);

//create a subscription
financeRouter.post('/create-subscription',authenticate,createSubscriptionValidationRules,checkRouteValidity,createSubscription);

//verify a subscription payment
financeRouter.post('/verify-subscription',authenticate,verifySubscriptionValidationRules,checkRouteValidity,verifySubscription);
export default financeRouter;

//respond to razorpay webhook
financeRouter.post('/razorpay/respond-to-webhook',respondToWebhook);