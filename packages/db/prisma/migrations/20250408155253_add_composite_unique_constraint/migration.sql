/*
  Warnings:

  - A unique constraint covering the columns `[url,userId]` on the table `Website` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Website_url_key";

-- CreateIndex
CREATE UNIQUE INDEX "Website_url_userId_key" ON "Website"("url", "userId");
