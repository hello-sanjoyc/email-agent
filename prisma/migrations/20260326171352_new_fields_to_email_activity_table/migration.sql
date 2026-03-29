/*
  Warnings:

  - Added the required column `plan_id` to the `email_activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscription_id` to the `email_activities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "email_activities" ADD COLUMN     "plan_id" UUID NOT NULL,
ADD COLUMN     "subscription_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "email_activities" ADD CONSTRAINT "email_activities_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_activities" ADD CONSTRAINT "email_activities_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
