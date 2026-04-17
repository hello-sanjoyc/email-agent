-- AlterTable
ALTER TABLE "email_activities" ADD COLUMN     "message_date" TIMESTAMP(3),
ADD COLUMN     "message_sender" TEXT,
ADD COLUMN     "message_subject" TEXT;
