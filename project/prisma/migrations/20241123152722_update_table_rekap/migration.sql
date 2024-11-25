/*
  Warnings:

  - You are about to drop the column `id_pembayaran` on the `Rekap` table. All the data in the column will be lost.
  - You are about to drop the `Pembayaran` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `id_pembelian` to the `Rekap` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pembayaran" DROP CONSTRAINT "Pembayaran_id_pembelian_fkey";

-- DropForeignKey
ALTER TABLE "Rekap" DROP CONSTRAINT "Rekap_id_pembayaran_fkey";

-- AlterTable
ALTER TABLE "Rekap" DROP COLUMN "id_pembayaran",
ADD COLUMN     "id_pembelian" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Pembayaran";

-- AddForeignKey
ALTER TABLE "Rekap" ADD CONSTRAINT "Rekap_id_pembelian_fkey" FOREIGN KEY ("id_pembelian") REFERENCES "Pembelian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
