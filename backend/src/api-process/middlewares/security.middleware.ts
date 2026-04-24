import { Request, Response, NextFunction } from 'express';
import { encrypt, decrypt } from '../utils/crypto.utils.js';
import env from '../../config/env.js';
import { logger } from '../../config/logger.js';

export const securityTunnel = async (req: Request, res: Response, next: NextFunction) => {
    // ========================================================
    // 1. EXCLUSIONS (Webhooks & External Callbacks)
    // ========================================================
    // Third-party services like Razorpay do not have our encryption key.
    // They will send raw JSON directly to our webhook endpoints.
    // We must bypass the tunnel completely for these routes.
    if (req.originalUrl.includes('/razorpay/respond-to-webhook')) {
        return next();
    }

    // ========================================================
    // 2. INBOUND DECRYPTION (Frontend -> Node.js)
    // ========================================================
    // If the request contains a 'payload' key, we assume it is an encrypted string from Flutter.
    if (req.body && req.body.payload) {
        try {
            // Await the asynchronous decryption to keep the event loop unblocked
            const decryptedString = await decrypt(req.body.payload, env.IN_TRANSIT_ENCRYPTION_KEY);
            
            // Parse the decrypted string and overwrite the original req.body.
            // Downstream validators and controllers will now see standard JSON.
            req.body = JSON.parse(decryptedString);
            
        } catch (err) {
            logger.error("Security Tunnel Decryption Failed", err);
            return res.status(400).json({ 
                error: true, 
                code: 'DECRYPTION_ERROR',
                message: "Security Handshake Failed: Invalid or corrupted payload." 
            });
        }
    }

    // ========================================================
    // 3. OUTBOUND ENCRYPTION (Node.js -> Frontend)
    // ========================================================
    // Save a reference to the original Express res.json function
    const originalJson = res.json;

    // Overwrite res.json with our custom interceptor.
    // The "this: Response" declaration fixes the TypeScript ts(2683) error.
    res.json = function (this: Response, body: any) {
        // If an error occurs (status 400 and above), send it in plain text.
        // This ensures the Flutter app can read validation errors or system failures 
        // without needing to decrypt an error payload.
        if (this.statusCode >= 400) {
            return originalJson.call(this, body);
        }

        // Express does not natively `await` res.json(), so we handle 
        // the asynchronous encryption using a Promise chain.
        encrypt(JSON.stringify(body), env.IN_TRANSIT_ENCRYPTION_KEY)
            .then((encryptedBody) => {
                // Send the securely wrapped payload over the network
                return originalJson.call(this, { payload: encryptedBody });
            })
            .catch((err) => {
                logger.error("Security Tunnel Encryption Failed", err);
                // Fallback error if the server fails to encrypt the outgoing response
                return originalJson.call(this, { 
                    error: true, 
                    code: 'ENCRYPTION_ERROR',
                    message: "Failed to securely package the response." 
                });
            });

        // Return 'this' to maintain Express method chaining (e.g., res.status(200).json(...))
        return this as any;
    } as any;

    // ========================================================
    // 4. PROCEED TO ROUTES
    // ========================================================
    // Pass the request down to the validators and controllers
    next();
};