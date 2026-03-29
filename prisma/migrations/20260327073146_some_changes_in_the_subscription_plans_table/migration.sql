/*
  Warnings:

  - You are about to drop the column `monthly_quota` on the `subscription_plans` table. All the data in the column will be lost.
  - Added the required column `max_emails_per_run` to the `subscription_plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quota` to the `subscription_plans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscription_plans" DROP COLUMN "monthly_quota",
ADD COLUMN     "max_emails_per_run" INTEGER NOT NULL,
ADD COLUMN     "quota" INTEGER NOT NULL;
