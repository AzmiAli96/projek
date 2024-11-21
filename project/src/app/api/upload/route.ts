import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./public/uploads"; // Lokasi penyimpanan gambar
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Middleware untuk menangani file upload
const uploadMiddleware = upload.single("image");

export const config = {
  api: {
    bodyParser: false, // Nonaktifkan bodyParser agar multer bisa digunakan
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    uploadMiddleware(req as any, {} as any, async (err: any) => {
      if (err) {
        return res.status(500).json({ error: "Gagal mengunggah file" });
      }

      const file = (req as any).file; // Mendapatkan file dari middleware
      const { id_user, id_barang } = req.body; // Ambil `id_user` dan `id_barang` dari body

      if (!file) {
        return res.status(400).json({ error: "File tidak ditemukan" });
      }

      if (!id_user || !id_barang) {
        return res.status(400).json({ error: "ID user dan ID barang harus disediakan" });
      }

      const imagePath = `/uploads/${file.filename}`; // Path file untuk disimpan di database

      try {
        // Update status pembelian dengan path gambar
        const pembelian = await prisma.pembelian.updateMany({
          where: {
            id_user: parseInt(id_user),
            id_barang: parseInt(id_barang),
            status: "Belum Bayar", // Pastikan hanya update yang belum dibayar
          },
          data: {
            status: imagePath, // Simpan path gambar ke kolom `status`
          },
        });

        if (pembelian.count === 0) {
          return res.status(404).json({ error: "Pembelian tidak ditemukan atau sudah terupdate" });
        }

        return res.status(200).json({ message: "Gambar berhasil diunggah", pembelian });
      } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Gagal menyimpan data ke database" });
      }
    });
  } else {
    return res.status(405).json({ error: "Method tidak diizinkan" });
  }
}
