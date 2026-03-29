/*
  Warnings:

  - Added the required column `calendar_account_id` to the `email_activities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "email_activities" ADD COLUMN     "calendar_account_id" UUID NOT NULL;
