'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, Send, CheckCircle2, AlertCircle, MessageSquare, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
          setFormData((prev) => ({
            ...prev,
            name: data.user.name || '',
            email: data.user.email || '',
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setFormData({
          name: user ? user.name || '' : '',
          email: user ? user.email || '' : '',
          subject: '',
          message: '',
        });
      } else {
        setError(data.error || 'Failed to send message.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen py-12 md:py-20 cosmic-stars overflow-hidden">
      {/* Nebula Ambient Glows */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-cyan-500/20 blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-950/50 px-4 py-1.5 text-xs font-mono font-medium text-cyan-300 shadow-[0_0_15px_rgba(217,70,239,0.2)]">
            <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
            <span>CONTACT & INQUIRIES</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-5xl tracking-tight break-words">
            Get in Touch with KELDORATHAL
          </h1>
          <p className="text-purple-200/90 text-sm sm:text-base leading-relaxed">
            Have a project inquiry, software requirement, or question? Send a message directly to founder Muhammad Zakarya without requiring an account.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Contact Info Side */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-purple-500/30 bg-[#120934]/90 p-5 sm:p-9 space-y-6 shadow-2xl backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white tracking-tight break-words">Direct Communication</h2>
              <p className="text-xs text-purple-200/80 leading-relaxed">
                We respond promptly to all client requests, technical discussions, and custom software estimates.
              </p>

              <div className="space-y-4">
                <a
                  href="https://wa.me/923278326788"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-purple-500/20 bg-[#0c0525] p-4 hover:border-emerald-500/40 hover:bg-[#0f072c] transition-all group min-w-0"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-mono text-purple-300/80">WhatsApp / Direct Call</span>
                    <span className="text-sm font-bold text-white group-hover:text-emerald-300 break-words">+92 327 8326788</span>
                  </div>
                </a>

                <a
                  href="mailto:muhammadzak4rya@gmail.com"
                  className="flex items-center gap-4 rounded-2xl border border-purple-500/20 bg-[#0c0525] p-4 hover:border-cyan-400/40 hover:bg-[#0f072c] transition-all group min-w-0"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-mono text-purple-300/80">Email Address</span>
                    <span className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 break-all">muhammadzak4rya@gmail.com</span>
                  </div>
                </a>
              </div>

              <div className="rounded-2xl border border-purple-500/30 bg-purple-950/40 p-4 text-xs text-purple-200 space-y-1">
                <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Guest Messaging Enabled</span>
                </span>
                <p className="text-[11px] text-purple-300/80">
                  You do not need to create an account to get in touch. Simply fill in the form and we will reach back out to you.
                </p>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-purple-500/30 bg-[#120934]/90 p-5 sm:p-9 space-y-6 shadow-2xl backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white tracking-tight break-words">Send a Message to Founder / Admin</h2>

              {success ? (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-5 sm:p-9 text-center space-y-4">
                  <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white">Message Sent Successfully!</h3>
                  <p className="text-sm text-purple-200 max-w-md mx-auto">
                    Your message has been sent successfully. We will get back to you soon.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-2.5 text-xs font-bold text-white hover:scale-105 transition-all shadow-md shadow-emerald-600/30"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-950/30 p-3.5 text-xs text-red-200">
                      <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-purple-200 mb-1.5 font-mono">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-2xl border border-purple-500/30 bg-[#0c0525] px-4 py-3 text-sm text-white placeholder-purple-300/40 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-purple-200 mb-1.5 font-mono">
                        Your Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-2xl border border-purple-500/30 bg-[#0c0525] px-4 py-3 text-sm text-white placeholder-purple-300/40 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-purple-200 mb-1.5 font-mono">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Web Development Inquiry or Project Quote"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full rounded-2xl border border-purple-500/30 bg-[#0c0525] px-4 py-3 text-sm text-white placeholder-purple-300/40 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-purple-200 mb-1.5 font-mono">
                      Message Details *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us about your project or inquiry..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-2xl border border-purple-500/30 bg-[#0c0525] px-4 py-3 text-sm text-white placeholder-purple-300/40 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(56,189,248,0.6)] hover:scale-[1.01] disabled:opacity-50 transition-all"
                  >
                    <Send className="h-4 w-4" />
                    <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
