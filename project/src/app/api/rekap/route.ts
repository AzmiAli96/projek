import { PrismaClient } from "@prisma/client";
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const items = await prisma.rekap.findMany({ include: { pembelian: true, pengeluaran: true } });
        return Response.json({
            statusCode: 200,
            msg: "Successfully getting rekap data",
            data: items
        });
    } catch (error) {
        return Response.json({
            statusCode: 500,
            msg: "Internal server error" + error
        });
    }
}

type rekap = {
    id_pembelian: number
    id_pengeluaran: number
    bulan: Date
    penghasilan_bersih: number
    penghasilan_kotor: number
    pembelian: {
        id_barang: number
        jumlah_beli: number
        barang: {
            harga: number
        }
    }
    pengeluaran: {
        biaya: number
    }
}

export async function POST(req: Request) {
    try {
        const body: rekap = await req.json();
        const targetDate = new Date(body.bulan.toISOString().slice(0, 10));

        // const barang = await prisma.barang.findUnique({
        //     where: { id: body.pembelian.id_barang },
        // });

        // if (!barang) {
        //     return Response.json({
        //         statusCode: 404,
        //         msg: "Barang not found",
        //     });
        // }

        const totalPembelian = await prisma.pembelian.aggregate({
            _sum:{
                jumlah_beli: true,
                id_barang: true
            },
            where: {
                tanggal: {
                    gte: new Date(targetDate.toISOString() + "T00:00:00.000Z"),
                    lt: new Date(targetDate.toISOString() + "T23:59:59.999Z"),
                },
            },
        });

        const totalPengeluaran = await prisma.pengeluaran.aggregate({
            _sum: {
                biaya: true,
            },
            where: {
                tanggal:{
                    gte: new Date(targetDate.toISOString() + "T00:00:00.000Z"),
                    lt: new Date(targetDate.toISOString() + "T23:59:59.999Z"),
                }
            }
        });


        const totalHarga = totalPembelian._sum.jumlah_beli || 0;
        const totalBiaya = totalPengeluaran._sum.biaya || 0;
        const penghasilanBersih = totalHarga;
        const penghasilanKotor =new Decimal (totalHarga).minus(totalBiaya);

        // const pengeluaran = body.pengeluaran.biaya;
        // const penghasilan_bersih = totalHarga;
        // const penghasilan_kotor = totalHarga - pengeluaran;

        const existingRekap = await prisma.rekap.findFirst({
            where: {
                id_pembelian: body.id_pembelian,
                bulan: {
                    gte: new Date(body.bulan.toISOString().slice(0, 10) + "T00:00:00.000z"),
                    lt: new Date(body.bulan.toISOString().slice(0, 10) + "T23:59:59.999Z"),
                }
            }
        });

        if (existingRekap) {
            const updateRekap = await prisma.rekap.update({
                where: { id: existingRekap.id },
                data: {
                    penghasilan_bersih: new Decimal(existingRekap.penghasilan_bersih).plus(penghasilanBersih),
                    penghasilan_kotor: new Decimal(existingRekap.penghasilan_kotor).plus(penghasilanKotor),
                },
            });

            return Response.json({
                statusCode: 200,
                msg: "Successfully Update Data",
                data: updateRekap
            });
        } else {
            const newItem = await prisma.rekap.create({
                data: {
                    id_pembelian: Number(body.id_pembelian),
                    id_pengeluaran: Number(body.id_pengeluaran),
                    bulan: new Date(body.bulan),
                    penghasilan_bersih: penghasilanBersih,
                    penghasilan_kotor: penghasilanKotor
                }
            });
            return Response.json({
                statusCode: 201,
                msg: "Successfuly Create Data",
                data: newItem
            });
        }

    } catch (error) {
        return Response.json({
            statusCode: 500,
            msg: "Internal Server Error" + error
        })
    }
}
