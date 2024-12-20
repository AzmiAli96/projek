import { PrismaClient } from "@prisma/client";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET() {
    try {
        const items = await prisma.pembelian.findMany({
            include: { barang: true, user: true },
            orderBy: {
                tanggal: "desc"
            }
        });
        return Response.json({
            statusCode: 200,
            msg: "successfully getting data",
            data: items
        })
    } catch (error) {
        return Response.json({ msg: "Internal server error" })
    }
}

// ------------------------------------- INSERT --------------------------------------------


type pembelian = {
    id_user: number
    id_barang: number
    tanggal: Date
    jumlah_beli: number
    status: string
    keputusan: string
    barang: {
        kode_barang: string,
        nama_barang: string,
        harga: number
    }
    user: {
        name: string
        email: string
    }
}




export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        console.log("Data yang diterima:", data);

        // Validasi apakah data adalah array
        if (!Array.isArray(data)) {
            return NextResponse.json({ msg: "Data harus berupa array" }, { status: 400 });
        }

        // Ambil ID cart
        const ids = data.map((item: any) => item.idCart);
        console.log("ID carts:", ids);

        const carts = await prisma.cart.findMany({
            where: { id: { in: ids } },
        });

        if (carts.length === 0) {
            return NextResponse.json({ msg: "Cart tidak ditemukan" }, { status: 404 });
        }

        // Simpan transaksi menggunakan Prisma Transaction
        const pembelian = await prisma.$transaction(
            carts.map((cart) =>
                prisma.pembelian.create({
                    data: {
                        id_barang: cart.id_barang,
                        id_user: cart.id_user,
                        jumlah_beli: cart.jumlah_cart,
                        status: "belum bayar",
                        keputusan: "dalam proses",
                        tanggal: new Date().toISOString(),
                    },
                })
            )
        );

        return NextResponse.json({
            msg: "Berhasil melakukan pemesanan",
            data: pembelian,
        }, { status: 201 });
    } catch (e: any) {
        console.error("Error:", e);
        return NextResponse.json({
            msg: "Internal server error",
            error: e.message,
        }, { status: 500 });
    }
}
