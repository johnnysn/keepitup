-- CreateTable
CREATE TABLE "TaskPrototype" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weekDays" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1,
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "TaskPrototype_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaskPrototype_userEmail_idx" ON "TaskPrototype"("userEmail");

-- AddForeignKey
ALTER TABLE "TaskPrototype" ADD CONSTRAINT "TaskPrototype_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
