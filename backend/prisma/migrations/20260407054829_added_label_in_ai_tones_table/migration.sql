-- CreateEnum
CREATE TYPE "AIResponseToneLabel" AS ENUM ('Casual', 'Professional');

-- AlterTable
ALTER TABLE "ai_tones" ADD COLUMN     "label" "AIResponseToneLabel" NOT NULL DEFAULT 'Professional';
