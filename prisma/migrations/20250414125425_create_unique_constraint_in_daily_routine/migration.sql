/*
  Warnings:

  - A unique constraint covering the columns `[userEmail,date]` on the table `DailyRoutine` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DailyRoutine_userEmail_date_key" ON "DailyRoutine"("userEmail", "date");
