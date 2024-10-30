import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const itemById = await prisma.barang.findUnique({
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
