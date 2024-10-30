-- CreateTable
CREATE TABLE "Barang" (
    "id" SERIAL NOT NULL,
    "kode_barang" TEXT NOT NULL,
    "nama_barang" TEXT NOT NULL,
    "ket" TEXT NOT NULL,
    "harga" DECIMAL(65,30) NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Barang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pembelian" (
    "id" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_barang" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "jumlah_beli" INTEGER NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Pembelian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pembayaran" (
    "id" SERIAL NOT NULL,
    "id_pembelian" INTEGER NOT NULL,
    "harga_bayar" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Pembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengeluaran" (
    "id" SERIAL NOT NULL,
    "jenis_pengeluaran" TEXT NOT NULL,
    "Ket" TEXT NOT NULL,
    "biaya" DECIMAL(65,30) NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pengeluaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rekap" (
    "id" SERIAL NOT NULL,
    "id_pembayaran" INTEGER NOT NULL,
    "id_pengeluaran" INTEGER NOT NULL,
    "bulan" TIMESTAMP(3) NOT NULL,
    "penghasilan_bersih" DECIMAL(65,30) NOT NULL,
    "penghasilan_kotor" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Rekap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Barang_kode_barang_key" ON "Barang"("kode_barang");

-- AddForeignKey
ALTER TABLE "Pembelian" ADD CONSTRAINT "Pembelian_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pembelian" ADD CONSTRAINT "Pembelian_id_barang_fkey" FOREIGN KEY ("id_barang") REFERENCES "Barang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pembayaran" ADD CONSTRAINT "Pembayaran_id_pembelian_fkey" FOREIGN KEY ("id_pembelian") REFERENCES "Pembelian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rekap" ADD CONSTRAINT "Rekap_id_pembayaran_fkey" FOREIGN KEY ("id_pembayaran") REFERENCES "Pembayaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rekap" ADD CONSTRAINT "Rekap_id_pengeluaran_fkey" FOREIGN KEY ("id_pengeluaran") REFERENCES "Pengeluaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
