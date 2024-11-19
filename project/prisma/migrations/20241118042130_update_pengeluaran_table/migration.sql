/*
  Warnings:

  - You are about to drop the column `Ket` on the `Pengeluaran` table. All the data in the column will be lost.
  - Added the required column `ket` to the `Pengeluaran` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pengeluaran" DROP COLUMN "Ket",
ADD COLUMN     "ket" TEXT NOT NULL;
