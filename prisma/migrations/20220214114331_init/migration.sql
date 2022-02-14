/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `authentications` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_authenticationId_fkey";

-- DropIndex
DROP INDEX "users_authenticationId_key";

-- AlterTable
ALTER TABLE "authentications" ADD COLUMN     "userId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "authentications_userId_key" ON "authentications"("userId");

-- AddForeignKey
ALTER TABLE "authentications" ADD CONSTRAINT "authentications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
