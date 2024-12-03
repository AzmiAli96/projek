import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import cookie from "cookie";

const allowedPathByRole: { [key: string]: string[] } = {
    admin: ["/admin/dashboard", "/admin/rekap"],
    sales: ["/sales/pengeluaran", "/sales/pendapatan"],
    customer: ["/customers/tampilan", "/customers/pesanan"],
};

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "ini-rahasia");

export async function middleware(req: Request) {
    const cookies = req.headers.get("cookie");
    const parsedCookies = cookie.parse(cookies || "");
    const token = parsedCookies.token;

    console.log("Cookies:", parsedCookies);

    if (!token) {
        console.warn("Token tidak ditemukan. Redirect ke /auth/signin");
        return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    try {
        // Verifikasi token menggunakan jose
        const { payload } = await jwtVerify(token, secret);
        const user = payload as { id: string; level: string };
        const currentPath = new URL(req.url).pathname;

        console.log("Decoded Token:", user);
        console.log("Current Path:", currentPath);

        const allowedPaths = allowedPathByRole[user.level] || [];
        const isPathAllowed = allowedPaths.some((allowedPath) =>
            currentPath.startsWith(allowedPath)
        );

        console.log("Allowed Paths:", allowedPaths);
        console.log("Is Path Allowed:", isPathAllowed);

        if (!isPathAllowed) {
            console.warn("Path tidak diizinkan. Redirect ke /403");
            return NextResponse.redirect(new URL("/403", req.url));
        }

        return NextResponse.next();
    } catch (err) {
        console.error("Token tidak valid:", err);
        return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
}

export const config = {
    matcher: ["/admin/:path*", "/sales/:path*", "/customers/:path*"],
};
