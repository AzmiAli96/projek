import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ------------------------ MENDAPATKAN DATA BERDASARKAN ID ----------------------------------
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const itemById = await prisma.pembelian.findUnique({
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
// ------------------------ END MENDAPATKAN DATA BERDASARKAN ID ----------------------------------

type pembelian = {
    id_barang: number
    id_user: number
    tanggal: string
    jumlah_beli: number
    status: string,
    keputusan: string
}

// ------------------------ UPDATE DATA BERDASARKAN ID ----------------------------------

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        const updatedpembelian = await prisma.pembelian.update({
            where: { id: Number(id) },
            data: {
                ...body // Menggunakan properti yang dikirim saja
            }
        });

        return new Response(JSON.stringify({
            statusCode: 200,
            msg: "Successfully updated data",
            data: updatedpembelian
        }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({
            statusCode: 500,
            msg: "Internal server error",
            error: error
        }), { status: 500 });
    }
}


// ------------------------ END UPDATE DATA BERDASARKAN ID ----------------------------------

// ------------------------ END MENDAPATKAN DATA BERDASARKAN ID ----------------------------------