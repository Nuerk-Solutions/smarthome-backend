/*
  Warnings:

  - You are about to drop the column `emailAdress` on the `authentications` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emailAddress]` on the table `authentications` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `emailAddress` to the `authentications` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "authentications_emailAdress_key";

-- AlterTable
ALTER TABLE "authentications" DROP COLUMN "emailAdress",
ADD COLUMN     "emailAddress" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "authentications_emailAddress_key" ON "authentications"("emailAddress");
