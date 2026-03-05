import 'dotenv/config'
import z from 'zod'

const envSchema = z.object({
    DATABASE_URL:z.string().default(""),
    DATABASE_HOST:z.string().default("localhost"),
    DATABASE_PORT:z.coerce.number().default(5432),
    DATABASE_USER:z.string().default("postgres"),
    DATABASE_PASSWORD:z.string().default(""),
    DATABASE_DATABASE:z.string().default("email_agent_db"),
    APP_PORT:z.coerce.number().default(3000),
    JWT_SECRET:z.string().default("demojwtsecret"),
    JWT_REFRESH_SECRET:z.string().default('demojwtrefreshsecret'),
    JWT_EXPIRATION_TIME:z.string().default("15m"),
    JWT_REFRESH_EXPIRE_TIME:z.string().default("7d"),
    GOOGLE_CLIENT_ID:z.string().default(""),
    GOOGLE_CLIENT_SECRET:z.string().default(""),
    GOOGLE_REDIRECT_URI:z.string().default("")
});

const env = envSchema.parse(process.env);
export default env;