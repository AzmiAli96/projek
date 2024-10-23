import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try{
const user = await prisma.user.findMany();
return Response.json({statusCode: 200, msg: "successfully get data", data: user})
  }catch(error){

  }
}