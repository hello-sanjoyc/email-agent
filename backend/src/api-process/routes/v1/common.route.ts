import { Router } from 'express';
import { authenticate } from '../../middlewares/authentication.js';
import { getSubscriptionPlans , getCurrentSubscriptionPlan, createSubscription,verifySubscription, respondToWebhook } from '../../controllers/v1/finance.controller.js';
import { createSubscriptionValidationRules, verifySubscriptionValidationRules } from '../../validators/finance.validator.js';
import { checkRouteValidity } from '../../middlewares/validationMiddleware.js';
import { createEnquiry } from '../../controllers/v1/common.controller.js';

//TODO:the express validation is left out for now, REMEMBER TO ADD IT!
const commonRouter = Router();
//get all subscription plans
commonRouter.post('/enquiry/create',createEnquiry);

export default commonRouter;