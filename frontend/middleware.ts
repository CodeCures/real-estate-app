import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const url = new URL(req.url)
    const authPaths = ['/login', '/register']
    const isAuthPath = authPaths.includes(url.pathname);

    if (!token && !isAuthPath) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    if (token && isAuthPath) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/(login|register|dashboard|portfolio)',
        '/property/:path*',
        '/portfolio/:path*'
    ],
};