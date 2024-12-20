import { PrismaClient, User } from "@prisma/client";
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body as { email: string; password: string };

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || !user.password) {
            return new Response(JSON.stringify({
                statusCode: 400,
                msg: "User not registered or missing password"
            }), { status: 400 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        // const isPasswordValid = password === user.password;
        if (!isPasswordValid) {
            return new Response(JSON.stringify({
                statusCode: 400,
                msg: "invalid credentials"
            }), { status: 400 });
        }

        const token = sign(
            { id: user.id, email: user.email, name: user.name, level: user.level, nohp: user.nohp, alamt: user.alamat, image: user.image, },
            process.env.JWT_SECRET ?? "ini-rahasia",
            { expiresIn: "1h" }
        );

        let redirectUrl = "/";
        if (user.level === "admin") {
            redirectUrl = "/admin/dashboard";
        } else if (user.level === "sales") {
            redirectUrl = "/sales/pendapatan";
        } else if (user.level === "customer") {
            redirectUrl = "/customers/tampilan";
        }

        // buat headers set-Cookies
        const headers = new Headers();
        headers.append(
            "set-Cookie",
            `token=${token}; Path=/; SameSite=Lax; Max-Age3600`
        )


        return new Response(JSON.stringify({
            statusCode: 200,
            msg: "Login succesful",
            data: { id: user.id, email: user.email, name: user.name, level: user.level, nohp: user.nohp, alamt: user.alamat, image: user.image, token, redirectUrl }
        }), { status: 200, headers });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({
            statusCode: 500,
            msg: "Server Error" + error
        }), { status: 500 });
    }
}
