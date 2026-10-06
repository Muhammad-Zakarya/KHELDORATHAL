'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Clock, CheckCircle2, Plus, ArrowRight } from 'lucide-react';

export default function CustomerDashboardPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.user);
      });

    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.orders) setOrders(data.orders);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Reviewed').length;
  const completedOrders = orders.filter((o) => o.status === 'Completed').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'In Progress':
      case 'Accepted':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'Rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-purple-500/30 bg-[#120934]/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight break-words">Welcome, {user?.name || 'Customer'} 👋</h1>
          <p className="text-xs text-purple-200/80 mt-1">
            Track your custom software & web development orders with KELDORATHAL.
          </p>
        </div>
        <Link
          href="/services"
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-5 py-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(56,189,248,0.6)] hover:scale-105 transition-all self-start sm:self-auto shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Place New Order</span>
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        <div className="rounded-3xl border border-purple-500/25 bg-[#120934]/90 p-4 sm:p-6 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-purple-300">Total Orders</span>
            <ShoppingBag className="h-4 w-4 text-cyan-400 shrink-0" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white">{totalOrders}</p>
        </div>

        <div className="rounded-3xl border border-purple-500/25 bg-[#120934]/90 p-4 sm:p-6 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-purple-300">Pending / Review</span>
            <Clock className="h-4 w-4 text-amber-400 shrink-0" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">{pendingOrders}</p>
        </div>

        <div className="rounded-3xl border border-purple-500/25 bg-[#120934]/90 p-4 sm:p-6 space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-purple-300">Completed Orders</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{completedOrders}</p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-3xl border border-purple-500/25 bg-[#120934]/90 p-5 sm:p-7 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Recent Orders</h2>
          <Link href="/customer/orders" className="text-xs font-bold text-cyan-300 hover:text-white flex items-center gap-1 transition-colors">
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs font-mono text-purple-300">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <ShoppingBag className="h-10 w-10 text-purple-400 mx-auto" />
            <p className="text-sm text-purple-200">You haven&apos;t placed any orders yet.</p>
            <Link
              href="/services"
              className="inline-block text-xs font-bold text-cyan-300 underline hover:text-white"
            >
              Browse Services & Order Now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-left text-xs">
              <thead>
                <tr className="border-b border-purple-500/20 text-purple-300 uppercase font-mono">
                  <th className="py-3 px-3">Project</th>
                  <th className="py-3 px-3">Service</th>
                  <th className="py-3 px-3">Budget</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10 text-purple-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-white">{order.projectTitle}</td>
                    <td className="py-3.5 px-3 text-purple-200/80">{order.service}</td>
                    <td className="py-3.5 px-3 font-mono">{order.currency === 'PKR' ? 'Rs' : '$'} {order.budget}</td>
                    <td className="py-3.5 px-3 text-purple-300/70">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-3.5 px-3 text-right">
                      <span className={`inline-block rounded-full border px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                        {order.status}
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
