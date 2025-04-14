/*
  Warnings:

  - You are about to drop the column `date` on the `DailyRoutine` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userEmail,dateStr]` on the table `DailyRoutine` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dateStr` to the `DailyRoutine` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "DailyRoutine_userEmail_date_idx";

-- DropIndex
DROP INDEX "DailyRoutine_userEmail_date_key";

-- AlterTable
ALTER TABLE "DailyRoutine" DROP COLUMN "date",
ADD COLUMN     "dateStr" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "DailyRoutine_userEmail_dateStr_idx" ON "DailyRoutine"("userEmail", "dateStr");

-- CreateIndex
CREATE UNIQUE INDEX "DailyRoutine_userEmail_dateStr_key" ON "DailyRoutine"("userEmail", "dateStr");
