/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `TaskPrototype` will be added. If there are existing duplicate values, this will fail.

*/

-- CreateIndex
CREATE UNIQUE INDEX "TaskPrototype_name_key" ON "TaskPrototype"("name");
