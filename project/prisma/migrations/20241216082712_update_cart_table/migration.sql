/*
  Warnings:

  - You are about to drop the column `status` on the `Cart` table. All the data in the column will be lost.
  - Added the required column `id_user` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "status",
ADD COLUMN     "id_user" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
