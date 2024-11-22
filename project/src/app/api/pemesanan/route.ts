import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function GET() {
    try {
        const items = await prisma.pembelian.findMany({include: {barang:true}});
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
    status: string,
    barang: {
        kode_barang: string,
  nama_barang:string,
  harga:number
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
                status: body.status
            }
        });

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
