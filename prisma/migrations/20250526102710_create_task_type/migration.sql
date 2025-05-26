-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('DAILY', 'FLOATING');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "type" "TaskType" NOT NULL DEFAULT 'FLOATING';
