import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const uploadPath = path.join(process.cwd(), "public/stocks");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    console.log("FormData received:", Array.from(formData.entries()));

    const file = formData.get("image") as File;
    const id = formData.get("id");

    if (!file) {
      return NextResponse.json(
        { error: "Gambar harus disediakan." },
        { status: 400 }
      );
    }

    const filePath = path.join(uploadPath, `${Date.now()}-${file.name}`);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const imagePath = `/stocks/${path.basename(filePath)}`;

    let barang = null;
    if (id) {
      barang = await prisma.barang.update({
        where: { id: Number(id) },
        data: { image: imagePath },
      });

      if (!barang) {
        return NextResponse.json(
          { error: "Barang tidak ditemukan." },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      message: "Gambar berhasil diunggah.",
      data: imagePath,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: `Terjadi kesalahan: ${error}` },
      { status: 500 }
    );
  }
}
