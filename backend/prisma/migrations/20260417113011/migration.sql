/*
  Warnings:

  - A unique constraint covering the columns `[label]` on the table `email_actions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `label` to the `email_actions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "email_actions" ADD COLUMN     "label" VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "email_actions_label_key" ON "email_actions"("label");
