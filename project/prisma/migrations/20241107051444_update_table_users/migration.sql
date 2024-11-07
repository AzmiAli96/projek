/*
  Warnings:

  - You are about to drop the column `total` on the `Pembelian` table. All the data in the column will be lost.
  - Added the required column `status` to the `Pembelian` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pembelian" DROP COLUMN "total",
ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;
