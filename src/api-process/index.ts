import env from "../config/env";
import { logger } from "../config/logger";
import { app } from "./app";
import http from 'http';
let SERVER:http.Server;
const PORT = env.APP_PORT || 3003;
//server starting function
export const startAPIServer = async ()=>{
    try{             
        //SERVER INSTANCE CREATION AND STARTING
        SERVER = http.createServer(app);
        SERVER.listen(PORT,()=>{            
            logger.info(`[SERVER START] The server has started and is listening to port ${PORT}`);
        });        
    }catch(err){
        logger.error('error starting the server',err);        
    }    
}
export const closeAPIServer = async () => {
    if(SERVER){
        await new Promise((resolve,reject)=>{
            SERVER.close((err)=>{err?reject(err):resolve(true)});
        });
        logger.info('[HTTP SERVER] closed');
    }
}