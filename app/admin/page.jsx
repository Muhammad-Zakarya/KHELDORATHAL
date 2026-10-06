'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Cpu, Layers, ShoppingBag, Clock, MessageSquare, ArrowRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    customersCount: 0,
    projectsCount: 0,
    servicesCount: 0,
    ordersCount: 0,
    pendingOrdersCount: 0,
    messagesCount: 0,
    unreadMessagesCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/customers').then((r) => r.json()),
      fetch('/api/services').then((r) => r.json()),
      fetch('/api/projects').then((r) => r.json()),
      fetch('/api/orders').then((r) => r.json()),
      fetch('/api/messages?_t=' + Date.now(), { cache: 'no-store' }).then((r) => r.json()),
    ])
      .then(([custData, servData, projData, ordData, msgData]) => {
        const customers = custData.customers || [];
        const services = servData.services || [];
        const projects = projData.projects || [];
        const orders = ordData.orders || [];
        const messages = msgData.messages || [];

        const pending = orders.filter((o) => o.status === 'Pending' || o.status === 'Reviewed').length;

        setStats({
          customersCount: customers.length,
          servicesCount: services.length,
          projectsCount: projects.length,
          ordersCount: orders.length,
          pendingOrdersCount: pending,
          messagesCount: messages.length,
          unreadMessagesCount: msgData.unreadCount || 0,
        });

        setRecentOrders(orders.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-3xl border border-purple-500/30 bg-[#120934]/90 p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl backdrop-blur-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Admin Control Panel</span>
            <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)] animate-pulse shrink-0" />
          </h1>
          <p className="text-xs text-purple-200/80 mt-1">
            KELDORATHAL Business Overview & Order Management
          </p>
        </div>
        <span className="self-start sm:self-auto rounded-full bg-purple-500/20 border border-purple-400/40 px-4 py-1.5 text-xs font-mono font-bold text-purple-200 shadow-sm">
          Muhammad Zakarya
        </span>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        <Link href="/admin/customers" className="rounded-3xl border border-purple-500/25 bg-[#120934]/90 p-4 sm:p-6 space-y-2 shadow-xl hover:border-cyan-400/50 hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-purple-300">Total Customers</span>
            <Users className="h-4 w-4 text-cyan-400 shrink-0" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{stats.customersCount}</p>
        </Link>

        <Link href="/admin/orders" className="rounded-3xl border border-purple-500/25 bg-[#120934]/90 p-4 sm:p-6 space-y-2 shadow-xl hover:border-purple-400/50 hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-purple-300">Total Orders</span>
            <ShoppingBag className="h-4 w-4 text-indigo-400 shrink-0" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{stats.ordersCount}</p>
        </Link>

        <Link href="/admin/orders" className="rounded-3xl border border-purple-500/25 bg-[#120934]/90 p-4 sm:p-6 space-y-2 shadow-xl hover:border-amber-400/50 hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-purple-300">Pending Orders</span>
            <Clock className="h-4 w-4 text-amber-400 shrink-0" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">{stats.pendingOrdersCount}</p>
        </Link>

        <Link href="/admin/services" className="rounded-3xl border border-purple-500/25 bg-[#120934]/90 p-4 sm:p-6 space-y-2 shadow-xl hover:border-blue-400/50 hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-purple-300">Total Services</span>
            <Layers className="h-4 w-4 text-blue-400 shrink-0" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{stats.servicesCount}</p>
        </Link>

        <Link href="/admin/projects" className="rounded-3xl border border-purple-500/25 bg-[#120934]/90 p-4 sm:p-6 space-y-2 shadow-xl hover:border-pink-400/50 hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-purple-300">Total Projects</span>
            <Cpu className="h-4 w-4 text-pink-400 shrink-0" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{stats.projectsCount}</p>
        </Link>

        <Link href="/admin/messages" className="rounded-3xl border border-purple-500/25 bg-[#120934]/90 p-4 sm:p-6 space-y-2 shadow-xl hover:border-emerald-400/50 hover:scale-[1.02] transition-all relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-purple-300">Customer Messages</span>
            <MessageSquare className="h-4 w-4 text-emerald-400 shrink-0" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{stats.messagesCount}</p>
            {stats.unreadMessagesCount > 0 && (
              <span className="rounded-full bg-pink-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm shadow-pink-600/50 animate-pulse">
                {stats.unreadMessagesCount} New
              </span>
            )}
          </div>
        </Link>
      </div>

      {/* Recent Orders Overview */}
      <div className="rounded-3xl border border-purple-500/25 bg-[#120934]/90 p-5 sm:p-7 space-y-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-500/20 pb-4">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Recent Customer Orders</h2>
          <Link href="/admin/orders" className="text-xs font-bold text-cyan-300 hover:text-white flex items-center gap-1 transition-colors">
            <span>Manage All Orders</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs font-mono text-purple-300">Loading metrics...</div>
        ) : recentOrders.length === 0 ? (
          <div className="py-8 text-center text-xs text-purple-300/80">No customer orders placed yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-left text-xs">
              <thead>
                <tr className="border-b border-purple-500/20 text-purple-300 uppercase font-mono">
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Service</th>
                  <th className="py-3 px-3">Budget</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10 text-purple-100">
                {recentOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-white">
                      {ord.customer?.name || 'Customer'}
                      <span className="block text-[10px] text-purple-300/60 font-normal">{ord.customer?.email}</span>
                    </td>
                    <td className="py-3.5 px-3 text-purple-200/80">{ord.service}</td>
                    <td className="py-3.5 px-3 font-mono">{ord.currency === 'PKR' ? 'Rs' : '$'} {ord.budget}</td>
                    <td className="py-3.5 px-3">
                      <span className="inline-block rounded-full bg-purple-500/20 border border-purple-400/40 px-3 py-0.5 text-[10px] font-semibold text-purple-200 uppercase">
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
