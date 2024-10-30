import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function GET() {
    try {
        const items = await prisma.barang.findMany();
       return Response.json({
            statusCode: 200,
            msg: "successfully getting data",
            data: items
        })
    } catch (error) {
       return Response.json({msg: "Internal server error"})
    }
}

type barang ={
    kode_barang: string
    nama_barang :string
    ket :string
    harga: number
    jumlah: number
    image: string
}

export async function POST(req: Request) {
    try {
        const body: barang = await req.json();
        console.log(body);
        
        const newItem =await prisma.barang.create({
            data: {
                kode_barang: body.kode_barang,
                nama_barang: body.nama_barang,
                ket: body.ket,
                jumlah: Number(body.jumlah),
                harga: Number(body.harga),
                image: body.image
            }
        })

        return Response.json({
            statusCode: 201,
            msg: "successfully getting data",
            data: newItem
        })
    } catch (error) {
        return Response.json({
            statusCode: 500,
            msg: "Internal server error"
        })
    }
}
