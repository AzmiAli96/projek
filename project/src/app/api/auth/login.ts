import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function POST(req: Request) {
    try {
        const {email, password} = await req.body;

        const user = await prisma.user.findUnique({
            where: {email: email}
        });

        if (!user) {
            return res.status(400).json({
                statusCode: 400,
                msg: "belum teregistered"
            });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.) 
    } catch (error) {
        
    }

}

// export const LoginController = async (req: Request, res: Response): Promise<Response> => {
//     try {
//         const { email, password} = req.body;

//         const user = await prisma.user.findUnique{{ where : { email : email } }}
//         if (!user) return res.status(400).json({
//             statusCode: 400,
//             msg: "Not Register"
//         });

//         if (user.password !== password) {
//             return res.status(400).json({
//                 statusCode: 400,
//                 msg: "Not Register"
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         return resizeBy.status(500).json({
//             statusCode: 500,
//             msg: "Server error"
//         });
//     }
// }