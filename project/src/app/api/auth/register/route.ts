import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, level, nohp } = body as {
            name: string;
            email: string;
            password: string;
            level: string;
            nohp: string;
        }

        if (!name || !email || !password || !level || !nohp) {
            return new Response(JSON.stringify({
                satatusCode: 400,
                msg: "All field are required"
            }), { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (user) {
            return new Response(JSON.stringify({
                satatusCode: 400,
                msg: "Email Already Have"
            }), { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                level,
                nohp,
            },
        });

        return new Response(
            JSON.stringify({
                statusCode: 201,
                msg: "User registered successfully",
                data: { id: newUser.id, email: newUser.email, name: newUser.name, level: newUser.level },
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({
                statusCode: 500,
                msg: "Server Error",
            }),
            { status: 500 }
        );
    }
}