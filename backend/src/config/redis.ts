import Redis from "ioredis";
import { logger } from "./logger";
import env from "./env";
import { mailer } from "./mailer";
import db, { pool } from "../db";
export let redisConnection:Redis;
export const initRedisConnection = () => {
    redisConnection = new Redis({
        host:env.REDIS_HOST,
        port:Number(env.REDIS_PORT),
        maxRetriesPerRequest:null,
        enableReadyCheck:false,
        username:env.REDIS_USERNAME,
        password:env.REDIS_PASSWORD
    });
    redisConnection.on('connect',()=>{
        logger.info("[REDIS CONNECTION] connected");
    });
    redisConnection.on('error',()=>{
        logger.info("[REDIS CONNECTION] error");       
    });
}
export const checkRedisConnectivity = async () => {  
    const tempRedisClient = new Redis({
        host:env.REDIS_HOST,
        port:Number(env.REDIS_PORT),
        maxRetriesPerRequest:0,
        username:env.REDIS_USERNAME,
        password:env.REDIS_PASSWORD
    });
    tempRedisClient.on('error',()=>{});
    try{       
        await tempRedisClient.ping();
        logger.info('[REDIS CONNECTION CHECK] successful');
        await tempRedisClient.quit();
    }catch(err){
        logger.error('[REDIS CONNECTION CHECK] error',{
            message:err instanceof Error?err.message:null,
            stack:err instanceof Error?err.stack:null
        });
        mailer.close();
        logger.info('[MAILER CONNECTION] closed');
        await Promise.allSettled([
            db.$disconnect(),
            pool.end()
        ]);
        logger.info('[DB CONNECTION] closed');
        process.exit(1);
   }
}
export const quitRedisConnection = async () => {
    await redisConnection.quit();
}