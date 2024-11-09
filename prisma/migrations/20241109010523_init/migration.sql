-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'PROCESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "Tasks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "Tasks_pkey" PRIMARY KEY ("id")
);
