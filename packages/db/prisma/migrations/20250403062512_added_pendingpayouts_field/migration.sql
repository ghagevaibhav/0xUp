/*
  Warnings:

  - You are about to drop the column `sol_address` on the `Validator` table. All the data in the column will be lost.
  - Added the required column `publicKey` to the `Validator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Validator" DROP COLUMN "sol_address",
ADD COLUMN     "pendingPayouts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "publicKey" TEXT NOT NULL;
