/*
  Warnings:

  - You are about to drop the column `authenticationId` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_authenticationId_fkey";

-- DropIndex
DROP INDEX "users_authenticationId_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "authenticationId";
