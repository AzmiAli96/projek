import { NextResponse } from 'next/server';

import jwt from 'jsonwebtoken';

export function middleware(req: Request) {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url)); // Redirect jika tidak ada token
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!); // Verifikasi token
        (req as any).user = decoded; // Tambahkan data pengguna ke request
    } catch (err) {
        return NextResponse.redirect(new URL('/auth/signin', req.url)); // Redirect jika token tidak valid
    }

    return NextResponse.next(); // Lanjutkan ke rute berikutnya
}

export const config = {
    matcher: ['/protected/:path*'], // Proteksi halaman yang diawali dengan /protected/
};
