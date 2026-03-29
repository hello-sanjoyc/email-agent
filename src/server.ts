import http from 'http'
import {app} from './app.js'
import env from './config/env.js'
import { logger } from './config/logger.js';
import db, { checkDBConnectivity, pool } from './db/index.js';
import { closeEmailSenderWorker, initEmailSenderWorker } from './jobs/workers/emailSenderWorker.js';
import { checkMailerConnectivity, mailer } from './config/mailer.js';
import {checkRedisConnectivity, initRedisConnection, quitRedisConnection} from './config/redis.js';
import { closeEmailProcessorWorker, initEmailProcessorWorker } from './jobs/workers/emailProcessorWorker.js';
import { initEmailSendingQueue } from './jobs/queues/emailSendingQueue.js';
import { initEmailProcessingQueue } from './jobs/queues/emailProcessingQueue.js';
import { initEmailProcessorSchedular } from './jobs/schedulers/emailProcessorScheduler.js';
import { initRazorpayWebhookProcessingQueue } from './jobs/queues/razorpayWebhookProcessingQueue.js';
import { initRazorpayWebhookProcessorWorker } from './jobs/workers/razorpayWebhookProcessorWorker.js';
import { initSubscriptionCleanupQueue } from './jobs/queues/subscriptionCleanupQueue.js';
import { initSubscriptionCleanupWorker } from './jobs/workers/subscriptionCleanupWorker.js';
let SERVER:http.Server;
const PORT = env.APP_PORT || 3003;
//server starting function
const startAPIServer = async ()=>{
    try{        
        //INIT THE BULLMQ INSTANCES
        initEmailSendingQueue();
        //razorpay webhook processing queue instance initiation
        initRazorpayWebhookProcessingQueue();        
        //SERVER INSTANCE CREATION AND STARTING
        SERVER = http.createServer(app);
        SERVER.listen(PORT,()=>{            
            logger.info(`[SERVER START] The server has started and is listening to port ${PORT}`);
        });        
    }catch(err){
        logger.error('error starting the server',err);        
    }    
}
//server shutdown function
async function gracefulShutdown(signal:string){
    const timeoutID = setTimeout(() => {
        logger.warn('[APPLICATION SHUTDOWN] forcing shutdown. Bye...');
        process.exit(1);
    }, 10000); // 10 seconds max     
    try{                
        //close BULLMQ workers
        await Promise.all([
            closeEmailSenderWorker(),
            closeEmailProcessorWorker()
        ]);                
        logger.info('[BULLMQ WORKERS] closed');                
        //close HTTP server
        if(SERVER){
            await new Promise((resolve,reject)=>{
                SERVER.close((err)=>err?reject(err):resolve(true));
            });
            logger.info('[HTTP SERVER] closed');
        }                     
        //close PRISMA CLIENT AND UNDERLYING POSTGRES CONNECTION POOL
        await Promise.allSettled([
            db.$disconnect(),
            pool.end()
        ]);        
        logger.info('[DB CONNECTION] closed');             
        //close NODEMAILER SMTP CLIENT
        mailer.close();
        logger.info('[MAILER CONNECTION] closed');
        //close REDIS CONNECTION
        await quitRedisConnection();
        logger.info('[REDIS CONNECTION] closed');
        clearTimeout(timeoutID);
        logger.info('[APPLICAION SHUTDOWN] Bye...');
        process.exit(0);                     
    }catch(err){
        logger.error('[APPLICATION SHUTDOWN] error',{
            message: (err instanceof Error)?err.message:null,
            stack:(err instanceof Error)?err.stack:null
        });                              
    }      
}

//event handler if any uncaught exception occurs at global level
process.on('uncaughtException',(err:Error)=>{
    logger.error('[APPLICATION UNCAUGHT EXCEPTION] error',{
        message:err instanceof Error?err.message:null,
        stack:err instanceof Error?err.stack:null,        
    });
    process.exit(1);
});
//event handler if any unhandled rejection occurs at global level
process.on('unhandledRejection',(reason:any)=>{
    logger.error('[APPLICATION UNCAUGHT EXCEPTION] error',{reason});
    process.exit(1);
});
//event handlers for if any shutdown signal comes in the process ('SIGINT' and 'SIGTERM' these two are mainly shutdown signals)
process.on('SIGINT',async ()=>await gracefulShutdown('SIGINT'));
process.on('SIGTERM',async ()=>await gracefulShutdown('SIGTERM'));
const startSchedulerProcess = () => {
    //EMAIL PROCESSING BULLMQ INSTANCE CREATION
    initEmailProcessingQueue();
    //STARTING THE SCHEDULAR
    initEmailProcessorSchedular();
    logger.info(`[SCHEDULAR PROCESS] started`);
}
const startQueueWorkerProcess = () => {
    //INIT THE BULLMQ INSTANCES
    initEmailSendingQueue(); 
    initSubscriptionCleanupQueue();
    //INIT THE BULLMQ WORKERS(ALWAYS AFTER CHECKING THE REDIS CONNECTIVITY)
    initEmailProcessorWorker();
    initEmailSenderWorker();
    initRazorpayWebhookProcessorWorker();
    initSubscriptionCleanupWorker();
    logger.info(`[QUEUE WORKER PROCESS] started`);
}
const bootstrap = async () => {
    try{
        //DB CONNECTION CHECK
        await checkDBConnectivity();        
        //MAILER CONNECTION CHECK
        await checkMailerConnectivity();        
        //REDIS CONNECTION CHECK AND CONNECTION INIT
        await checkRedisConnectivity();
        initRedisConnection();        
        //DECIDE WHAT TO START BASED ON PROCESS TYPE(API or SCHEDULER)
        if(env.PROCESS_TYPE === "API"){
            await startAPIServer();
        }else if(env.PROCESS_TYPE === "SCHEDULER"){ 
            startSchedulerProcess();
        }else if(env.PROCESS_TYPE === "WORKER"){ 
            startQueueWorkerProcess();
        }else{
            throw new Error(`Unknown Process: ${env.PROCESS_TYPE}`);
        }
    }catch(err){
        logger.error('[BOOTSTRAPING] error',{
            stack: err instanceof Error? err.stack:null,
            message: err instanceof Error? err.message:null
        });
        process.exit(1);
    }    
}

//nodejs process bootstrapping
bootstrap();