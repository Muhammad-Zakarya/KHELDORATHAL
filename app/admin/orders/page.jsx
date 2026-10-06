'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, MessageSquare } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = () => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.orders) setOrders(data.orders);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        fetchOrders();
      } else {
        alert(data.error || 'Failed to update order status');
      }
    } catch {
      alert('Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  const statusOptions = ['Pending', 'Reviewed', 'Accepted', 'In Progress', 'Completed', 'Rejected'];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10';
      case 'In Progress':
      case 'Accepted':
        return 'border-blue-500/40 text-blue-400 bg-blue-500/10';
      case 'Rejected':
        return 'border-red-500/40 text-red-400 bg-red-500/10';
      default:
        return 'border-amber-500/40 text-amber-400 bg-amber-500/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white break-words">Manage Customer Orders</h1>
          <p className="text-xs text-purple-200/70">Review project requests and update order progress.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="rounded-full border border-purple-500/30 bg-[#120934] p-2.5 text-slate-400 hover:text-white hover:border-cyan-400/50 transition-colors shrink-0"
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-mono text-purple-300">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="py-12 text-center text-xs text-purple-200/60">No orders submitted yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div
              key={ord._id}
              className="rounded-3xl border border-purple-500/30 bg-[#0d0725] p-4 sm:p-6 space-y-4 hover:border-purple-500/60 shadow-xl transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-500/20 pb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                      {ord.service}
                    </span>
                    <span className="text-xs text-purple-300/60 font-mono">
                      #{ord._id.substring(ord._id.length - 6)}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-0.5 break-words">{ord.projectTitle}</h3>
                  <p className="text-xs text-purple-200/70 break-all">
                    Customer: <span className="text-white font-semibold">{ord.customer?.name}</span> ({ord.customer?.email})
                  </p>
                </div>

                {/* Status Dropdown */}
                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <span className="text-xs font-mono text-purple-300/70">Status:</span>
                  <select
                    value={ord.status}
                    disabled={updatingId === ord._id}
                    onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-bold focus:outline-none ${getStatusStyle(ord.status)}`}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#0e0728] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="text-xs text-purple-100/90 leading-relaxed bg-[#070318] p-4 rounded-2xl border border-purple-500/20 whitespace-pre-line break-words">
                <span className="block text-[10px] font-mono text-cyan-400 uppercase mb-1">Order Details / Scope</span>
                {ord.description}
              </div>

              {/* Specs Footer */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1 border-t border-purple-500/20">
                <div>
                  <span className="block text-purple-300/60 font-mono">Budget:</span>
                  <span className="font-semibold text-white">{ord.currency === 'PKR' ? 'Rs' : '$'} {ord.budget}</span>
                </div>
                <div>
                  <span className="block text-purple-300/60 font-mono">Deadline:</span>
                  <span className="font-semibold text-purple-100">{ord.deadline || 'Flexible'}</span>
                </div>
                <div>
                  <span className="block text-purple-300/60 font-mono">Order Date:</span>
                  <span className="font-semibold text-purple-100">{new Date(ord.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="block text-purple-300/60 font-mono">Currency:</span>
                  <span className="font-semibold text-cyan-300">{ord.currency}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-purple-500/20">
                <Link
                  href={`/admin/messages?orderId=${ord._id}&customerId=${ord.customer?._id || ''}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500 hover:text-black transition-all shadow-sm w-full sm:w-auto text-center"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Message Customer</span>
                </Link>
                <span className="text-[11px] font-mono text-purple-300/60 break-all">
                  Customer: {ord.customer?.name} ({ord.customer?.email})
                </span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
