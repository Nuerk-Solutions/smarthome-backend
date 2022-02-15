-- DropForeignKey
ALTER TABLE "authentications" DROP CONSTRAINT "authentications_userId_fkey";

-- AddForeignKey
ALTER TABLE "authentications" ADD CONSTRAINT "authentications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
