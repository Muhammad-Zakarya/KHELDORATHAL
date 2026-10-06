'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldAlert, LayoutDashboard, Layers, Cpu, ShoppingBag, Users, MessageSquare, Loader2, LogOut } from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.success || !data.user || data.user.role !== 'admin') {
          router.push('/login');
        }
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));

    // Fetch unread messages count for notification tag
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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-2 text-purple-400 font-mono text-sm">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Verifying Admin Authorization...</span>
        </div>
      </div>
    );
  }

  const adminLinks = [
    { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Manage Services', href: '/admin/services', icon: Layers },
    { name: 'Manage Projects', href: '/admin/projects', icon: Cpu },
    { name: 'Manage Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Registered Customers', href: '/admin/customers', icon: Users },
    {
      name: 'Customer Messages',
      href: '/admin/messages',
      icon: MessageSquare,
      badge: unreadMessages > 0 ? `${unreadMessages} New` : null,
    },
  ];

  return (
    <div className="relative min-h-screen py-8 cosmic-stars">
      {/* Nebula Ambient Glow */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Admin Sidebar Navigation */}
          <aside className="md:col-span-3 space-y-4">
            <div className="rounded-3xl border border-purple-500/30 bg-[#120934]/90 p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl backdrop-blur-xl">
              <div className="border-b border-purple-500/20 pb-4">
                <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Admin Console</span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1 break-words">Muhammad Zakarya</h2>
                <p className="text-xs text-purple-300/80">Founder & Administrator</p>
              </div>

              <nav className="space-y-1.5">
                {adminLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center justify-between gap-2 rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600/40 to-indigo-600/30 text-purple-200 border border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                          : 'text-purple-200/80 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <Icon className="h-4 w-4 text-purple-400 shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </div>

                      {/* Notification Tag for Messages */}
                      {item.badge && (
                        <span className="shrink-0 rounded-full bg-pink-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm shadow-pink-600/40 animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-purple-500/20">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full rounded-full border border-purple-500/30 bg-purple-950/40 px-4 py-2.5 text-xs font-bold text-purple-200 hover:bg-purple-900/50 hover:text-white transition-all"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout Admin</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Admin Main Display Area */}
          <main className="md:col-span-9">{children}</main>

        </div>
      </div>
    </div>
  );
}
