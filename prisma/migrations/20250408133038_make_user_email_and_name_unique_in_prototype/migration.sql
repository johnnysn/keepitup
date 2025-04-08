/*
  Warnings:

  - A unique constraint covering the columns `[userEmail,name]` on the table `TaskPrototype` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TaskPrototype_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "TaskPrototype_userEmail_name_key" ON "TaskPrototype"("userEmail", "name");
