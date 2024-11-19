import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function GET() {
    try {
        const items = await prisma.pengeluaran.findMany();
        return Response.json({
            statusCode: 200,
            msg: "successfully getting data",
            data: items
        })
    } catch (error) {
        return Response.json({ msg: "Internal server error" })
    }
}

type pengeluaran = {
    jenis_pengeluaran: string
    ket: string
    biaya: number
    tanggal: Date
}

export async function POST(req: Request) {
    try {
        const body: pengeluaran = await req.json();

        const newItem = await prisma.pengeluaran.create({
            data: {
                jenis_pengeluaran: body.jenis_pengeluaran,
                ket: body.ket,
                biaya: Number(body.biaya),
                tanggal: new Date(body.tanggal),
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
            msg: "Internal server error" + error
        })
    }
}
