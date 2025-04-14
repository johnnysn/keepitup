-- CreateTable
CREATE TABLE "DailyRoutine" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "executed" BOOLEAN NOT NULL,
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "DailyRoutine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyRoutine_userEmail_date_idx" ON "DailyRoutine"("userEmail", "date");

-- AddForeignKey
ALTER TABLE "DailyRoutine" ADD CONSTRAINT "DailyRoutine_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
