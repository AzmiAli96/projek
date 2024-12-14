/*
  Warnings:

  - You are about to drop the column `id_cart` on the `Pembelian` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pembelian" DROP CONSTRAINT "Pembelian_id_cart_fkey";

-- AlterTable
ALTER TABLE "Pembelian" DROP COLUMN "id_cart";
