-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "generationsUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'FREE';
