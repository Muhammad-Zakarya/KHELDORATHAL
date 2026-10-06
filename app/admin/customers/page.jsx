'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, MessageSquare, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetch('/api/admin/customers')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.customers) setCustomers(data.customers);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteCustomer = async (cust) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete customer "${cust.name}" (${cust.email})?\n\nThis will permanently delete their account, orders, and messages.`
    );
    if (!confirmed) return;

    setDeletingId(cust._id);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/customers?id=${cust._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        setCustomers((prev) => prev.filter((c) => c._id !== cust._id));
        setFeedback({ type: 'success', text: `Customer "${cust.name}" deleted successfully.` });
      } else {
        setFeedback({ type: 'error', text: data.error || 'Failed to delete customer' });
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Network error occurred while deleting' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-purple-500/20 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white break-words">Registered Customers</h1>
        <p className="text-xs text-purple-200/70">
          View customer accounts registered on KELDORATHAL, message them directly, or manage accounts.
        </p>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 rounded-2xl p-4 text-xs font-semibold ${
            feedback.type === 'success'
              ? 'border border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
              : 'border border-red-500/40 bg-red-950/40 text-red-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-xs font-mono text-purple-300">Loading customers...</div>
      ) : customers.length === 0 ? (
        <div className="py-12 text-center text-xs text-purple-200/60">No registered customers yet.</div>
      ) : (
        <div className="rounded-3xl border border-purple-500/30 bg-[#0d0725] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[550px] text-left text-xs">
              <thead>
                <tr className="border-b border-purple-500/20 bg-[#120934]/90 text-purple-300 uppercase font-mono">
                  <th className="py-3 px-3 sm:px-5">Name</th>
                  <th className="py-3 px-3 sm:px-5">Email</th>
                  <th className="py-3 px-3 sm:px-5">Role</th>
                  <th className="py-3 px-3 sm:px-5">Joined Date</th>
                  <th className="py-3 px-3 sm:px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10 text-purple-100/90">
                {customers.map((cust) => (
                  <tr key={cust._id} className="hover:bg-[#160c38]/50 transition-colors">
                    <td className="py-3 px-3 sm:px-5 font-semibold text-white flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      <span>{cust.name}</span>
                    </td>
                    <td className="py-3 px-3 sm:px-5 text-purple-200/80">{cust.email}</td>
                    <td className="py-3 px-3 sm:px-5">
                      <span className="rounded-full bg-cyan-500/10 border border-cyan-400/30 px-2.5 py-0.5 text-[10px] font-mono text-cyan-300 uppercase">
                        {cust.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 sm:px-5 text-purple-300/60 font-mono">
                      {new Date(cust.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 sm:px-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/admin/messages?customerId=${cust._id}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-500 hover:text-black transition-all shadow-sm"
                        >
                          <MessageSquare className="h-3 w-3" />
                          <span>Message</span>
                        </Link>

                        <button
                          onClick={() => handleDeleteCustomer(cust)}
                          disabled={deletingId === cust._id}
                          className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300 hover:bg-red-600 hover:text-white transition-all shadow-sm disabled:opacity-50"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>{deletingId === cust._id ? 'Deleting...' : 'Delete'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
