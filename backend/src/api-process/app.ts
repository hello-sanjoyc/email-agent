import express from 'express'
import morgan from 'morgan'
import { logger } from '../config/logger.js'
import cookieParser from 'cookie-parser'
import { v4 as uuidv4 } from 'uuid'


import type { Request , Response , NextFunction } from 'express'
import { MulterError } from 'multer'
import cors from 'cors';
import AppError from './utils/appError.utils.js'
import authRouter from './routes/v1/auth.route.js'
import { reqContext } from '../config/context.js'
import userRouter from './routes/v1/user.route.js'
import financeRouter from './routes/v1/finance.route.js'
import commonRouter from './routes/v1/common.route.js'
// import { securityTunnel } from './middlewares/security.middleware.js'
export const app = express();
app.use(cors({
    origin: ['https://ema.aranax.tech','http://localhost:5173'], // For demo purposes, this allows any origin
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));
// app.use(express.json());
app.use((req:Request,res:Response,next:NextFunction)=>{
    const reqId = uuidv4();
    const store = new Map();
    store.set('requestId',reqId);
    reqContext.run(store,()=>{
        next();
    });
});
app.use(morgan((tokens, req, res) => {
    const m = tokens.method as any;
    const u = tokens.url as any;
    const s = tokens.status as any;
    const r = tokens['response-time'] as any; 
    // Collect data safely
    const logData = {
        method: m(req, res),
        url: u(req, res),
        status: s(req, res),
        responseTime: `${r?.(req, res) || '0'}ms`,
        requestId: (req as any).id, // From your new requestId middleware
    };

    return JSON.stringify(logData);
}, {
    // We tell winston that this incoming string is already JSON-like
    stream: { 
        write: (msg) => {
            try {
                const data = JSON.parse(msg);
                logger.info("Incoming Request", data);
            } catch (e) {
                logger.info(msg.trim());
            }
        }
    } 
}));
app.use(cookieParser());
app.use(express.json({
    verify:(req,res,buf) => {
        (req as Request).rawBody = buf;
    }
}));
app.use(express.urlencoded({ extended: true }));

// app.use(securityTunnel);

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/user',userRouter);
app.use('/api/v1/finance',financeRouter);
app.use('/api/v1/common',commonRouter);

app.use((err:Error,req:Request,res:Response,next:NextFunction)=>{
    logger.error(err.message,{
        stack:err.stack,
        url:req.originalUrl,
        method:req.method,
        body: req.method === "POST"?req.body:undefined,
        userId:req.user?.id
    });
    if(err instanceof MulterError){
        return res.status(400).json({
            error: true,
            code:'FILE_ERROR',
            message: err.message,        
        });
    }else if(err instanceof AppError){
        return res.status(err.statusCode).json({
            error:true,
            code:"ERROR",
            message:err.message
        });
    }else{
        return res.status(500).json({
            error: true,
            code:"ERROR",         
            message: err.message,        
        });
    }
})