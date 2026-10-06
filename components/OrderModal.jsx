'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Lock, CheckCircle2, Send, AlertCircle, ShoppingBag } from 'lucide-react';

export default function OrderModal({ isOpen, onClose, selectedService, user }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    projectTitle: '',
    description: '',
    budget: '',
    currency: 'USD',
    deadline: 'Flexible',
    additionalRequirements: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: selectedService?.title || 'Custom Software Solution',
          projectTitle: formData.projectTitle,
          description: formData.description + (formData.additionalRequirements ? `\n\nAdditional Requirements: ${formData.additionalRequirements}` : ''),
          budget: formData.budget,
          currency: formData.currency,
          deadline: formData.deadline,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to submit order.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl border border-purple-500/30 bg-[#120934]/95 p-5 sm:p-8 shadow-2xl backdrop-blur-xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-purple-300 hover:text-white rounded-full p-1.5 hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* GUEST VIEW */}
        {!user ? (
          <div className="py-6 text-center space-y-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-400/40 bg-purple-950/60 text-cyan-300 shadow-[0_0_20px_rgba(217,70,239,0.3)]">
              <Lock className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Account Required</h3>
              <p className="text-sm text-purple-200 max-w-sm mx-auto">
                You need an account to order a service with <span className="font-semibold text-cyan-300">KELDORATHAL</span>.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-purple-500/40 bg-purple-950/50 text-sm font-bold text-purple-200 hover:bg-purple-900/50 hover:text-white transition-all text-center"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:scale-105 transition-all text-center"
              >
                Create Account
              </Link>
            </div>
          </div>
        ) : success ? (
          /* SUCCESS VIEW */
          <div className="py-8 text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Order Submitted!</h3>
              <p className="text-sm text-purple-200">
                Your order has been submitted successfully to <span className="text-cyan-300 font-medium">Muhammad Zakarya</span>.
              </p>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  router.push('/customer/orders');
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-bold text-white hover:scale-105 transition-all shadow-md shadow-blue-600/30"
              >
                View My Orders
              </button>
            </div>
          </div>
        ) : (
          /* CUSTOMER ORDER FORM VIEW */
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-purple-500/20 pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-600/20 text-cyan-300 border border-purple-400/30">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Order Service</h3>
                <p className="text-xs text-cyan-300 font-medium">{selectedService?.title || 'Custom Solution'}</p>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-950/30 p-3.5 text-xs text-red-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1.5 font-mono">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. E-Commerce Store or SaaS Web App"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  className="w-full rounded-2xl border border-purple-500/30 bg-[#0c0525] px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1.5 font-mono">
                  Project Description & Scope *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your requirements, goals, features..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-2xl border border-purple-500/30 bg-[#0c0525] px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1.5 font-mono">
                    Estimated Budget *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500 or Quote"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full rounded-2xl border border-purple-500/30 bg-[#0c0525] px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-purple-200 mb-1.5 font-mono">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full rounded-2xl border border-purple-500/30 bg-[#0c0525] px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="PKR">PKR (Rs)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-200 mb-1.5 font-mono">
                  Desired Deadline
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2 Weeks, 1 Month, or Flexible"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full rounded-2xl border border-purple-500/30 bg-[#0c0525] px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-purple-500/20">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto rounded-full border border-purple-500/30 bg-purple-950/40 px-5 py-2.5 text-xs font-bold text-purple-200 hover:bg-purple-900/50 text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/30 hover:scale-105 disabled:opacity-50 text-center"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{loading ? 'Submitting...' : 'Submit Order'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
