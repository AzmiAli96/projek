import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const userId = parseInt(params.id); // Ambil id dari URL params
        const body = await req.json();
        const { name, email, password, level, nohp, alamat } = body as {
            name?: string;
            email?: string;
            password?: string;
            level?: string;
            nohp?: string;
            alamat?: string;
        };

        // Validasi jika id tidak valid
        if (isNaN(userId)) {
            return new Response(
                JSON.stringify({ statusCode: 400, msg: "Invalid user ID" }),
                { status: 400 }
            );
        }

        // Cari user berdasarkan ID
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return new Response(
                JSON.stringify({ statusCode: 404, msg: "User not found" }),
                { status: 404 }
            );
        }

        // Data yang akan di-update
        let updatedData: any = {};
        if (name) updatedData.name = name;
        if (email) updatedData.email = email;
        if (level) updatedData.level = level;
        if (nohp) updatedData.nohp = nohp;
        if (alamat) updatedData.alamat = alamat;

        // Jika password diberikan, lakukan hashing
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedData.password = hashedPassword;
        }

        // Update user di database
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updatedData,
        });

        return new Response(
            JSON.stringify({
                statusCode: 200,
                msg: "User updated successfully",
                data: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    level: updatedUser.level,
                    nohp: updatedUser.nohp,
                    alamat: updatedUser.alamat,
                },
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating user:", error);
        return new Response(
            JSON.stringify({ statusCode: 500, msg: "Server Error" }),
            { status: 500 }
        );
    }
}
