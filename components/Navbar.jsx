'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, LayoutDashboard, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) return { success: false, user: null };
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (data.success && data.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        }
      })
      .catch(() => {
        if (isMounted) setUser(null);
      });

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Projects', href: '/projects' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-500/15 bg-[#08041c]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-[clamp(4px,1.5vw,32px)] py-[clamp(5px,0.8vw,14px)] gap-[clamp(2px,0.8vw,16px)] w-full">
        
        {/* LEFT: Brand Logo & Name with Cosmic Neon Accent */}
        <Link href="/" className="flex items-center gap-[clamp(2px,0.4vw,8px)] shrink-0 group">
          <div className="relative h-[clamp(15px,1.8vw,34px)] w-[clamp(15px,1.8vw,34px)] overflow-hidden rounded-[clamp(4px,0.6vw,10px)] border border-purple-500/40 bg-purple-950/40 shadow-[0_0_10px_rgba(217,70,239,0.25)] group-hover:shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all">
            <Image
              src="/images/logoo.png"
              alt="KELDORATHAL Logo"
              fill
              className="object-cover"
              sizes="34px"
              priority
            />
          </div>
          <span className="text-[clamp(8px,1.15vw,18px)] font-bold tracking-tight text-white font-mono flex items-center">
            KELDORATHAL
            <span className="inline-block h-[clamp(2px,0.3vw,5px)] w-[clamp(2px,0.3vw,5px)] rounded-full bg-cyan-400 ml-[clamp(1.5px,0.25vw,4px)] shadow-[0_0_6px_rgba(56,189,248,0.8)] animate-pulse" />
          </span>
        </Link>

        {/* CENTER: Navigation Links (Always visible across all viewports) */}
        <nav className="flex items-center gap-[clamp(1px,0.4vw,10px)] shrink py-0.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`rounded-full px-[clamp(2.5px,0.6vw,12px)] py-[clamp(1px,0.3vw,5px)] text-[clamp(6.5px,0.85vw,13.5px)] font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-cyan-300 font-semibold bg-purple-900/40 border border-purple-500/40 shadow-[0_0_10px_rgba(56,189,248,0.25)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: Login & Sign Up (Always visible at the right corner across all viewports) */}
        <div className="flex items-center gap-[clamp(2px,0.5vw,10px)] shrink-0">
          {user ? (
            <div className="flex items-center gap-[clamp(2px,0.4vw,8px)]">
              {user.role === 'admin' ? (
                <Link
                  href="/admin"
                  className="flex items-center gap-0.5 rounded-full border border-purple-500/40 bg-purple-600/20 px-[clamp(3px,0.6vw,12px)] py-[clamp(1px,0.3vw,5px)] text-[clamp(6.5px,0.8vw,12px)] font-semibold text-purple-200 hover:bg-purple-600/30 whitespace-nowrap transition-all shadow-[0_0_10px_rgba(168,85,247,0.25)]"
                >
                  <ShieldAlert className="h-[clamp(8px,0.9vw,13px)] w-[clamp(8px,0.9vw,13px)] text-purple-400 shrink-0" />
                  <span>Admin</span>
                </Link>
              ) : (
                <Link
                  href="/customer"
                  className="flex items-center gap-0.5 rounded-full border border-cyan-500/40 bg-cyan-600/20 px-[clamp(3px,0.6vw,12px)] py-[clamp(1px,0.3vw,5px)] text-[clamp(6.5px,0.8vw,12px)] font-semibold text-cyan-200 hover:bg-cyan-600/30 whitespace-nowrap transition-all shadow-[0_0_10px_rgba(56,189,248,0.25)]"
                >
                  <LayoutDashboard className="h-[clamp(8px,0.9vw,13px)] w-[clamp(8px,0.9vw,13px)] text-cyan-400 shrink-0" />
                  <span>Dashboard</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-0.5 rounded-full border border-slate-700/80 bg-slate-800/80 px-[clamp(3px,0.5vw,10px)] py-[clamp(1px,0.3vw,5px)] text-[clamp(6.5px,0.8vw,12px)] font-medium text-slate-300 hover:bg-slate-700 hover:text-white whitespace-nowrap transition-all"
                title="Logout"
              >
                <LogOut className="h-[clamp(8px,0.9vw,13px)] w-[clamp(8px,0.9vw,13px)] shrink-0" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-[clamp(2px,0.5vw,10px)]">
              <Link
                href="/login"
                className="rounded-full px-[clamp(3px,0.6vw,12px)] py-[clamp(1px,0.3vw,5px)] text-[clamp(6.5px,0.85vw,13.5px)] font-medium text-slate-300 hover:text-white whitespace-nowrap transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-[clamp(4px,0.8vw,16px)] py-[clamp(1px,0.3vw,5px)] text-[clamp(6.5px,0.85vw,13.5px)] font-semibold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(56,189,248,0.6)] whitespace-nowrap transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
