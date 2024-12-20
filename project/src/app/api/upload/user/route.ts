import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const uploadPath = path.join(process.cwd(), "public/user");

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

    const imagePath = `/user/${path.basename(filePath)}`;

    let user = null;
    if (id) {
      user = await prisma.user.update({
        where: { id: Number(id) },
        data: { image: imagePath },
      });

      if (!user) {
        return NextResponse.json(
          { error: "User tidak ditemukan." },
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
