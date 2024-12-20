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

export async function POST(req: Request) {
    try {
        const body: pembelian = await req.json();

        const newItem = await prisma.pembelian.create({
            data: {
                id_user: Number(body.id_user),
                id_barang: Number(body.id_barang),
                tanggal: new Date(body.tanggal),
                jumlah_beli: Number(body.jumlah_beli),
                status: body.status,
                keputusan: body.keputusan
            }
        });

        // mengurangkan jumlah stock sesuai dengan yang dipesan
        const decreementBarang = await prisma.barang.update({
            where: { id: newItem.id_barang },
            data: {
                jumlah: { decrement: newItem.jumlah_beli }
            }
        });

        return Response.json({
            statusCode: 201,
            msg: "Successfully Create Data",
            data: newItem
        })
    } catch (error) {
        return Response.json({
            statusCode: 500,
            msg: "Internal server error" + error
        })
    }
}

// ------------------------------------- END INSERT --------------------------------------------


// export async function POST(req: NextRequest) {
//     try {
//         const data = await req.json();
//         console.log(data);

//         const ids: [] = data.map((id: any) => id.idCart);
//         const { idCart } = await req.json();

//         // const test = await prisma.$transaction()
//         const cart = await prisma.cart.findFirst({
//             where: {
//                 id: Number(idCart)
//             }
//         });

//         if (!cart) {
//             return NextResponse.json({
//                 "msg": "cart tidak ditemukan"
//             }, { status: 400 })
//         }

//         const pembelian = await prisma.pembelian.create({
//             data: {
//                 id_barang: cart?.id_barang!,
//                 id_user: cart?.id_user!,
//                 jumlah_beli: cart?.jumlah_cart!,
//                 status: "belum bayar",
//                 keputusan: "dalam proses",
//                 tanggal: new Date().toISOString()
//             }
//         });

//         return NextResponse.json({
//             "msg": "Berhasil melakukan pemesanan",
//             "data": pembelian
//         }, { status: 201 })
//     } catch (e: any) {
//         return NextResponse.json({
//             "msg": "Internal server error",
//             "error": e.message
//         }, { status: 500 })
//     }
// }