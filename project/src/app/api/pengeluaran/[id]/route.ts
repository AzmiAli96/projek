import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const itemById = await prisma.pengeluaran.findUnique({
            where: { id: Number(id) }
        });

        if (!itemById) {
            return new Response(JSON.stringify({
                statusCode: 404,
                msg: "Item not found"
            }), { status: 404 });
        }

        return new Response(JSON.stringify({
            statusCode: 200,
            msg: "Successfully getting data",
            data: itemById
        }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({
            statusCode: 500,
            msg: "Internal server error"
        }), { status: 500 });
    }
}

type pengeluaran = {
    jenis_pengeluaran: string
    ket: string
    biaya: number
    tanggal: Date
}
// --------------------------- UPDATE DATA PENGELUARAN---------------------------------------


// --------------------------- END UPDATE DATA PENGELUARAN---------------------------------------

// --------------------------- DELETE DATA PENGELUARAN---------------------------------------

export async function DELETE(request: Request, { params }: { params: { id: number } }) {
    try {
        const { id } = params;
        
        const deletepengeluaran = await prisma.pengeluaran.delete({
            where: { id: Number(id) }
        })
        if (!deletepengeluaran) 
            return new Response(JSON.stringify({
        statusCode: 404,
        msg: "Item not found"
        }), { status: 404 });
        
        return new Response(JSON.stringify({
            statusCode: 200,
            msg: "Data deleted successfully",
            data: deletepengeluaran
        }), { status: 200 });
        
    } catch (error) {
        return new Response(JSON.stringify({
            statusCode: 500,
            msg: "Internal server error" + error
        }), { status: 500 });
    }
}

// --------------------------- DELETE DATA PENGELUARAN---------------------------------------