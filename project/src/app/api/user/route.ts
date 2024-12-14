import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const user = await prisma.user.findMany();
        return Response.json({
            statusCode: 200,
            msg: "successfully get data",
            data: user
        })
    } catch (error) {
        return Response.json({msg: "Internal server error"})
    }
}

type user ={
    name: string
    email: string
    level: string
    nohp: string
    alamat: string
}

export async function POST(req: Request) {
    try {
        const body: user = await req.json();

        const newItem = await prisma.user.create({
            data:{
                email: body.email,
                name: body.name,
                nohp: body.nohp,
                alamat: body.alamat,
                level: body.level
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