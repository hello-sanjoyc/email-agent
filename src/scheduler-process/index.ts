import { logger } from "../config/logger";
import { closeEmailProcessorScheduler, initEmailProcessorScheduler } from "./emailProcessorScheduler";

export const startSchedulerProcess = () => {
    
    //STARTING THE SCHEDULAR
    initEmailProcessorScheduler();
    logger.info(`[SCHEDULER PROCESS] started`);
}

export const stopSchedulerProcess = () => {
    closeEmailProcessorScheduler();
    logger.info(`[SCHEDULEER PROCESS] stopped`);
}