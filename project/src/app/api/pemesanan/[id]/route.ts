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
    status: string
}

// ------------------------ UPDATE DATA BERDASARKAN ID ----------------------------------

export async function PUT(request: Request, { params }: { params: { id: number } }) {
    try {
        const { id } = params;

        const findPembelian = await prisma.pembelian.findUnique({
            where: { id: Number(id) }
        })
        if (!findPembelian) return new Response(JSON.stringify({
            statusCode: 404,
            msg: "Item not found"
        }), { status: 404 });

        const body: pembelian = await request.json();

        const updatedpembelian = await prisma.pembelian.update({
            data: {
                id_user: body.id_user,
                id_barang: body.id_barang,
                tanggal: new Date(body.tanggal),
                jumlah_beli: body.jumlah_beli,
                status: body.status
            }, where: { id: Number(id) }
        })

        return new Response(JSON.stringify({
            statusCode: 200,
            msg: "Successfully updated data",
            data: updatedpembelian
        }), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({
            statusCode: 500,
            msg: "Internal server error" + error
        }), { status: 500 });
    }

}

// ------------------------ END UPDATE DATA BERDASARKAN ID ----------------------------------

// ------------------------ END MENDAPATKAN DATA BERDASARKAN ID ----------------------------------