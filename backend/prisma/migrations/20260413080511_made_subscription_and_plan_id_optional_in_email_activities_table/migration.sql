-- DropForeignKey
ALTER TABLE "email_activities" DROP CONSTRAINT "email_activities_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "email_activities" DROP CONSTRAINT "email_activities_subscription_id_fkey";

-- AlterTable
ALTER TABLE "email_activities" ALTER COLUMN "plan_id" DROP NOT NULL,
ALTER COLUMN "subscription_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "email_activities" ADD CONSTRAINT "email_activities_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "subscription_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_activities" ADD CONSTRAINT "email_activities_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
