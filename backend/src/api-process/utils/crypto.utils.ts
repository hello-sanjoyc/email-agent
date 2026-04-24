import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';

// Asynchronous Encryption
export const encrypt = (text: string, secret: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!text) return resolve(text);

        // 1. Asynchronous IV generation (offloads to libuv thread pool)
        crypto.randomBytes(16, (err, iv) => {
            if (err) return reject(err);

            // 2. setImmediate defers the synchronous math to the next event loop iteration
            setImmediate(() => {
                try {
                    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(secret, 'hex'), iv);
                    let encrypted = cipher.update(text);
                    encrypted = Buffer.concat([encrypted, cipher.final()]);
                    resolve(iv.toString('hex') + ':' + encrypted.toString('hex'));
                } catch (error) {
                    reject(error);
                }
            });
        });
    });
};

// Asynchronous Decryption
export const decrypt = (text: string, secret: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!text || !text.includes(':')) return resolve(text);

        setImmediate(() => {
            try {
                const textParts = text.split(':');
                const iv = Buffer.from(textParts.shift()!, 'hex');
                const encryptedText = Buffer.from(textParts.join(':'), 'hex');

                const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(secret, 'hex'), iv);
                let decrypted = decipher.update(encryptedText);
                decrypted = Buffer.concat([decrypted, decipher.final()]);

                resolve(decrypted.toString());
            } catch (error) {
                reject(error);
            }
        });
    });
};