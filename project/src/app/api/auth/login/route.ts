import { PrismaClient, User } from "@prisma/client";
import {sign} from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {email, password} = body as {email: string; password: string};

        const user = await prisma.user.findUnique({
            where: {email}
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

        const token = sign(      
             {id: user.id, email: user.email, name: user.name},
              process.env.JWT_SECRET ?? "ini-rahasia");
        // const token = jwt.sign(
        //     {id: user.id, email: user.email},
        //     process.env.JWT_SECRET!,
        //     {expriresIn: '1h'}
        // );

        return new Response(JSON.stringify({
            statusCode: 200,
            msg: "Login succesful",
            data: { id:user.id, email:user.email, token: token}
        }),{status: 200});

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({
            statusCode: 500,
            msg: "Server Error" + error
        }),{status: 500});
    }
}
