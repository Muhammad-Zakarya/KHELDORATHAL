'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, MessageSquare, User, Loader2, Sparkles } from 'lucide-react';

export default function CustomerLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.success || !data.user) {
          router.push('/login');
        } else if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          setUser(data.user);
        }
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));

    const fetchUnread = () => {
      fetch('/api/messages?_t=' + Date.now(), { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && typeof data.unreadCount === 'number') {
            setUnreadMessages(data.unreadCount);
          }
        })
        .catch(() => {});
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 6000);
    return () => clearInterval(interval);
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Verifying Session...</span>
        </div>
      </div>
    );
  }

  const links = [
    { name: 'Overview', href: '/customer', icon: LayoutDashboard },
    { name: 'My Orders', href: '/customer/orders', icon: ShoppingBag },
    {
      name: 'Messages & Support',
      href: '/customer/messages',
      icon: MessageSquare,
      badge: unreadMessages > 0 ? `${unreadMessages} New` : null,
    },
    { name: 'Profile', href: '/customer/profile', icon: User },
  ];

  return (
    <div className="relative min-h-screen py-8 cosmic-stars">
      {/* Nebula Ambient Glow */}
      <div className="absolute top-10 right-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Customer Sidebar Navigation */}
          <aside className="md:col-span-3 space-y-4">
            <div className="rounded-3xl border border-cyan-500/25 bg-[#120934]/90 p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl backdrop-blur-xl">
              <div className="border-b border-purple-500/20 pb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Customer Portal</span>
                </span>
                <h2 className="text-lg font-bold text-white truncate mt-1">{user?.name}</h2>
                <p className="text-xs text-purple-200/70 truncate">{user?.email}</p>
              </div>

              <nav className="space-y-1.5">
                {links.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center justify-between gap-2 rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600/30 to-cyan-600/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                          : 'text-purple-200/80 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="shrink-0 rounded-full bg-pink-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm shadow-pink-600/40 animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="md:col-span-9">{children}</main>

        </div>
      </div>
    </div>
  );
}
