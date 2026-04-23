import env from "../config/env";
import { logger } from "../config/logger";
import { app } from "./app";
import http from "http";

let SERVER: http.Server;

const PORT = Number(env.APP_PORT) || 3003;
const HOST = env.APP_HOST || "127.0.0.1"; // 🔒 force localhost

// server starting function
export const startAPIServer = async () => {
    try {
        SERVER = http.createServer(app);

        SERVER.listen(PORT, HOST, () => {
            logger.info(`[SERVER START] Listening on http://${HOST}:${PORT}`);
        });

        SERVER.on("error", (err) => {
            logger.error("[SERVER ERROR]", err);
            process.exit(1);
        });
    } catch (err) {
        logger.error("Error starting the server", err);
        process.exit(1);
    }
};

export const closeAPIServer = async () => {
    if (SERVER) {
        await new Promise((resolve, reject) => {
            SERVER.close((err) => (err ? reject(err) : resolve(true)));
        });
        logger.info("[HTTP SERVER] closed");
    }
};
