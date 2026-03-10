'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/assessment', label: 'Assessment' },
  { href: '/admin', label: 'Admin' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-ti-navy shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link href="/dashboard" className="flex-shrink-0">
            <span className="text-white font-bold text-lg">
              Transparency International Belgium
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-ti-yellow'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="flex items-center">
            <button
              onClick={() => {
                const supabaseImport = import('@/lib/supabase/client');
                supabaseImport.then(({ createClient }) => {
                  const supabase = createClient();
                  supabase.auth.signOut().then(() => {
                    window.location.href = '/auth/login';
                  });
                });
              }}
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex sm:hidden items-center space-x-4 pb-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-ti-yellow'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
