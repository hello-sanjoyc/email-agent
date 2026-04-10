-- CreateEnum
CREATE TYPE "ActionItemPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "ActionItemStatus" AS ENUM ('PENDING', 'DONE', 'DISMISSED');

-- CreateTable
CREATE TABLE "action_items" (
    "id" UUID NOT NULL,
    "email_activity_id" UUID NOT NULL,
    "summary" VARCHAR(300) NOT NULL,
    "deadline" TIMESTAMP(3),
    "priority" "ActionItemPriority" NOT NULL,
    "status" "ActionItemStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "action_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "action_items_email_activity_id_idx" ON "action_items"("email_activity_id");

-- AddForeignKey
ALTER TABLE "action_items" ADD CONSTRAINT "action_items_email_activity_id_fkey" FOREIGN KEY ("email_activity_id") REFERENCES "email_activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
