import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validasi ID
    if (!id || isNaN(Number(id))) {
      return new Response(
        JSON.stringify({
          statusCode: 400,
          msg: "Invalid ID parameter",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Query database
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return new Response(
        JSON.stringify({
          statusCode: 404,
          msg: "User not found",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Jika berhasil
    return new Response(
      JSON.stringify({
        statusCode: 200,
        msg: "Successfully retrieved user data",
        data: user,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error fetching user:", error);

    // Menangani kesalahan Prisma
    const errorMsg =
      error instanceof Error
        ? error.message
        : "Unexpected error occurred";

    return new Response(
      JSON.stringify({
        statusCode: 500,
        msg: "Internal server error",
        error: errorMsg,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
