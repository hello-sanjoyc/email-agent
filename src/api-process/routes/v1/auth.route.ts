import { Router } from 'express';
import { login, refreshToken, logout,register,sendPassResetMail,resetPassword } from '../../controllers/v1/auth.controller.js';
import { loginValidationRules, refreshValidationRules, logoutValidationRules, registerValidationRules, sendPassResetMailValidationRules, resetPasswordValidationRules } from '../../validators/auth.validator.js';
import { checkRouteValidity } from '../../middlewares/validationMiddleware.js';

const authRouter = Router();
authRouter.post('/register', registerValidationRules,checkRouteValidity,register);
//to login
authRouter.post('/login', loginValidationRules, checkRouteValidity, login);
//to refresh login token
authRouter.post('/refresh', refreshValidationRules, checkRouteValidity, refreshToken);
//to logout
authRouter.post('/logout', logoutValidationRules, checkRouteValidity, logout);
//pass reset link sending
authRouter.post('/send-passreset-mail',sendPassResetMailValidationRules,checkRouteValidity,sendPassResetMail);
//reset password
authRouter.post('/reset-password',resetPasswordValidationRules,checkRouteValidity,resetPassword);
export default authRouter;