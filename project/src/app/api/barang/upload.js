import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Nonaktifkan body parser bawaan untuk menangani FormData
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(process.cwd(), "public/images/barang");
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: "Gagal mengunggah file" });
        return;
      }

      const filePath = `/barang/${files.image.newFilename}`;
      // Simpan informasi barang beserta path gambar di database (tidak ditampilkan di sini)
      res.status(200).json({ filePath });
    });
  } else {
    res.status(405).json({ error: "Metode tidak diizinkan" });
  }
}
