import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const uploadPath = path.join(process.cwd(), "public/uploads");

// Pastikan folder upload tersedia
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Ambil file dan data tambahan
    const file = formData.get("image") as File;
    const id = formData.get("id");

    // Validasi input
    if (!file || !id) {
      return NextResponse.json(
        { error: "Gambar, id_user, dan id_barang harus disediakan." },
        { status: 400 }
      );
    }
    

    // Simpan file ke folder public/uploads
    const filePath = path.join(uploadPath, `${Date.now()}-${file.name}`);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const imagePath = `/uploads/${path.basename(filePath)}`;

    const pembelian = await prisma.pembelian.update({
      where:{id: Number(id)},
      data:{
        status: imagePath,
      }
    })

    // const barang = await prisma.barang.update({
    //   where:{id: Number(id)},
    //   data:{
    //     image: imagePath,
    //   }
    // })

    if (!pembelian) {
      return NextResponse.json(
        { error: "Pembelian tidak ditemukan atau sudah diperbarui." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Gambar berhasil diunggah.",
      data: imagePath,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: `Terjadi kesalahan saat mengunggah gambar: ${error}` },
      { status: 500 }
    );
  }
}
