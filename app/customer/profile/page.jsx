'use client';

import { useState, useEffect } from 'react';
import { User } from 'lucide-react';

export default function CustomerProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.user);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-12 text-center text-xs font-mono text-slate-400">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white break-words">My Account Profile</h1>
        <p className="text-xs text-slate-400">
          Personal account information and role details.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-[#0a0e19] p-5 sm:p-8 space-y-6 max-w-xl">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6 min-w-0">
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <User className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-white break-words">{user?.name}</h2>
            <span className="inline-block rounded-md bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-[11px] font-mono text-blue-400 uppercase mt-1">
              Role: Customer
            </span>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Full Name</label>
            <div className="rounded-xl border border-slate-800 bg-[#060913] px-4 py-2.5 text-white font-medium break-words">
              {user?.name}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Email Address</label>
            <div className="rounded-xl border border-slate-800 bg-[#060913] px-4 py-2.5 text-white font-medium break-all">
              {user?.email}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Account Type</label>
            <div className="rounded-xl border border-slate-800 bg-[#060913] px-4 py-2.5 text-slate-300 font-medium capitalize">
              {user?.role || 'Customer'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
