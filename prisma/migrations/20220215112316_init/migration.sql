/*
  Warnings:

  - You are about to drop the column `userId` on the `authentications` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authenticationId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "authentications" DROP CONSTRAINT "authentications_userId_fkey";

-- DropIndex
DROP INDEX "authentications_userId_key";

-- AlterTable
ALTER TABLE "authentications" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "authenticationId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "users_authenticationId_key" ON "users"("authenticationId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_authenticationId_fkey" FOREIGN KEY ("authenticationId") REFERENCES "authentications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
