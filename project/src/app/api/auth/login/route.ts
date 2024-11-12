import { PrismaClient, User } from "@prisma/client";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {email, password} = body as {email: string; password: string};

        const user = await prisma.user.findUnique({
            where: {email},
            select: { id: true, email: true, password: true } 
        });

        if (!user || !user.password) {
            return new Response(JSON.stringify({
                statusCode: 400,
                msg: "User not registered or missing password"
            }), { status: 400 });
        }
        
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        const isPasswordValid = password === user.password;
        if (!isPasswordValid) {
            return new Response(JSON.stringify({
                statusCode: 400,
                msg: "invalid credentials"
            }),{status: 400});
        } 

        return new Response(JSON.stringify({
            statusCode: 200,
            msg: "Login succesful",
            data: { id:user.id, email:user.email}
        }),{status: 200});

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({
            statusCode: 500,
            msg: "Server Error"
        }),{status: 500});
    }
}
