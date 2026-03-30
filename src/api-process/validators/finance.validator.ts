import { body } from "express-validator";

export const createSubscriptionValidationRules = [
    body("planId").exists().withMessage("plan ID is required")
    .isUUID().withMessage("plan ID must be a valid UUID string")
];
export const verifySubscriptionValidationRules = [
    body("razorpay_payment_id").exists().withMessage("Razorpay Payment ID is required")
    .isString().withMessage("Payment ID must be a string"),
    body("razorpay_subscription_id").exists().withMessage("Razorpay Subscription ID is required")
    .isString().withMessage("Subscription ID must be a string"),
    body("razorpay_signature").exists().withMessage("Razorpay Signature is required")
    .isString().withMessage("Signature must be a string"),
    body("internal_subscription_id").exists().withMessage("Internal Subscription ID is required")
    .isUUID().withMessage("Internal Subscription ID must be a UUID"),
];