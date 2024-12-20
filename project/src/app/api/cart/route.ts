import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function GET() {
    try {
        const items = await prisma.cart.findMany({
            include: {barang: true}
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

type cart={
    id_user: number
    id_barang: number
    jumlah_cart: number
    barang: {
        kode_barang: string,
        nama_barang: string,
        harga: number,
        ket: string,
        image: string
    }
}

export async function POST(req:Request) {
    try {
        const body: cart = await req.json();

        const newItem = await prisma.cart.create({
            data:{
                id_user: Number(body.id_user),
                id_barang: Number(body.id_barang),
                jumlah_cart: Number(body.jumlah_cart),
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