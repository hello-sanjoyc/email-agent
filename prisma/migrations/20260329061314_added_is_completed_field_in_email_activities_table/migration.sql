/*
  Warnings:

  - Added the required column `is_completed` to the `email_activities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "email_activities" ADD COLUMN     "is_completed" BOOLEAN NOT NULL;
