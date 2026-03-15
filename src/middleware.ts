import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

// Only dashboard and admin require login — assessment is open to all
const protectedRoutes = ['/dashboard', '/admin'];
const authRoutes = ['/auth/login', '/auth/register'];

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // updateSession handles cookie setting
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // Redirect unauthenticated users from protected routes to login
  if (!user && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Redirect authenticated users from auth pages to dashboard
  if (user && authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
