import env from './config/env.js'
import { logger } from './config/logger.js';
import db, { checkDBConnectivity, pool } from './db/index.js';
import { checkMailerConnectivity, mailer } from './config/mailer.js';
import {checkRedisConnectivity, initRedisConnection, quitRedisConnection} from './config/redis.js';
import { closeAPIServer, startAPIServer } from './api-process/index.js';
import { startSchedulerProcess, stopSchedulerProcess } from './scheduler-process/index.js';
import { startQueueWorkerProcess, stopQueueWorkerProcess } from './queue-worker-process/index.js';
import { closeEmailSendingQueue, initEmailSendingQueue } from './queues/emailSendingQueue.js';
import { closeSubscriptionCleanupQueue, initSubscriptionCleanupQueue } from './queues/subscriptionCleanupQueue.js';
import { closeEmailProcessingQueue, initEmailProcessingQueue } from './queues/emailProcessingQueue.js';
import { closeRazorpayWebhookProcessingQueue, initRazorpayWebhookProcessingQueue } from './queues/razorpayWebhookProcessingQueue.js';

//process bootstrap
const bootstrap = async () => {
    try{
        //DB CONNECTION CHECK
        await checkDBConnectivity();        
        //MAILER CONNECTION CHECK
        await checkMailerConnectivity();        
        //REDIS CONNECTION CHECK AND CONNECTION INIT
        await checkRedisConnectivity();
        //instantiate redis connection
        initRedisConnection();
        //instantiate queues
        
                
        //DECIDE WHAT TO START BASED ON PROCESS TYPE(API or SCHEDULER)
        switch(env.PROCESS_TYPE){
            case 'API':
                initEmailSendingQueue();
                initRazorpayWebhookProcessingQueue();  
                await startAPIServer();
                break;
            case 'WORKER':
                initEmailSendingQueue(); 
                initSubscriptionCleanupQueue();                    
                startQueueWorkerProcess();
                break;
            case 'SCHEDULER':
                initEmailProcessingQueue();
                startSchedulerProcess();
                break;
            default:
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
//process shutdown
async function gracefulShutdown(signal:string){
    const timeoutID = setTimeout(() => {
        logger.warn('[APPLICATION SHUTDOWN] forcing shutdown. Bye...');
        process.exit(1);
    }, 10000); // 10 seconds max            
    try{                     
        switch(env.PROCESS_TYPE){
            case 'API':
                await closeAPIServer();
                closeEmailSendingQueue();
                closeRazorpayWebhookProcessingQueue();
                break;
            case 'WORKER':
                await stopQueueWorkerProcess();
                closeEmailSendingQueue();
                closeSubscriptionCleanupQueue();
                break;
            case 'SCHEDULER':
                stopSchedulerProcess();
                closeEmailProcessingQueue();
                break;    
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

//nodejs process bootstrapping
bootstrap();   