'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, MessageSquare } from 'lucide-react';

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.orders) setOrders(data.orders);
      })
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'In Progress':
      case 'Accepted':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-500/20 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white break-words">My Service Orders</h1>
          <p className="text-xs text-purple-200/70">
            View the progress and status of your projects.
          </p>
        </div>
        <Link
          href="/services"
          className="self-start sm:self-auto rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-5 py-2.5 text-xs font-semibold text-white hover:opacity-95 transition-all shadow-lg shadow-cyan-500/20 shrink-0 text-center"
        >
          + Order Service
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-mono text-purple-300">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-purple-500/30 bg-[#0d0725] p-6 sm:p-12 text-center space-y-4 shadow-2xl">
          <ShoppingBag className="h-12 w-12 text-purple-400/50 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Orders Found</h3>
          <p className="text-sm text-purple-200/70 max-w-sm mx-auto">
            Ready to start a project with KELDORATHAL? Browse our services and submit your order details.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-6 py-2.5 text-xs font-semibold text-white hover:opacity-95 transition-all shadow-lg shadow-cyan-500/20"
          >
            <span>Explore Services</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-3xl border border-purple-500/30 bg-[#0d0725] p-4 sm:p-6 space-y-4 hover:border-purple-500/60 transition-all shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-500/20 pb-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                    {order.service}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white break-words">{order.projectTitle}</h3>
                </div>
                <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <p className="text-sm text-purple-100/90 leading-relaxed whitespace-pre-line break-words">
                {order.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-purple-500/20">
                <div>
                  <span className="block text-purple-300/60 font-mono">Budget:</span>
                  <span className="font-semibold text-purple-100">
                    {order.currency === 'PKR' ? 'Rs' : '$'} {order.budget}
                  </span>
                </div>
                <div>
                  <span className="block text-purple-300/60 font-mono">Deadline:</span>
                  <span className="font-semibold text-purple-100">{order.deadline || 'Flexible'}</span>
                </div>
                <div>
                  <span className="block text-purple-300/60 font-mono">Submitted Date:</span>
                  <span className="font-semibold text-purple-100">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="block text-purple-300/60 font-mono">Order ID:</span>
                  <span className="font-mono text-purple-300/80">#{order._id.substring(order._id.length - 6)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-purple-500/20">
                <Link
                  href={`/customer/messages?orderId=${order._id}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500 hover:text-black transition-all shadow-sm w-full sm:w-auto text-center"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Message about this order</span>
                </Link>
                <span className="text-[11px] font-mono text-purple-300/60 break-all">
                  {order.service} • #{order._id.substring(order._id.length - 6)}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
