-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT,
ALTER COLUMN "name" DROP NOT NULL;
