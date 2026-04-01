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
    GOOGLE_REDIRECT_URI:z.string().default(""),
    PASS_RESET_URL:z.string().default(""),
    REDIS_HOST:z.string().default("127.0.0.1"),
    REDIS_PORT:z.coerce.number().default(6379),
    MAIL_SMTP_HOST:z.string().default('aranaxweb.com'),
    MAIL_SMTP_PORT:z.coerce.number().default(465),
    APP_MAIL:z.string().default(""),
    APP_MAIL_PASSWORD:z.string().default(""),
    MICROSOFT_CLIENT_ID:z.string().default(""),
    MICROSOFT_CLIENT_SECRET:z.string().default(""),
    MICROSOFT_OBJECT_ID:z.string().default(""),
    MICROSOFT_TENANT_ID:z.string().default(""),
    PROCESS_TYPE:z.string().default(""),
    RAZORPAY_KEY:z.string().default(""),
    RAZORPAY_SECRET:z.string().default(""),
    FRONTEND_URL:z.string().default(""),
    N8N_WEBHOOK_URL:z.string().default(""),
    GROQ_API_KEY:z.string().default(""),
    GROQ_MODEL:z.string().default(""),
    GEMINI_API_KEY:z.string().default(""),
    GEMINI_MODEL:z.string().default(""),
    ACTIVE_AI_PROVIDER:z.string().default(""),
    REDIS_USERNAME:z.string().default(""),
    REDIS_PASSWORD:z.string().default("")
});

const env = envSchema.parse(process.env);
export default env;