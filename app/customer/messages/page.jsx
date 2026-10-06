'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  MessageSquare,
  Send,
  CheckCheck,
  ShieldCheck,
  Plus,
  X,
  RefreshCw,
  ShoppingBag,
  LogIn,
  UserPlus,
} from 'lucide-react';

function CustomerMessagesContent() {
  const searchParams = useSearchParams();
  const queryOrderId = searchParams.get('orderId');

  const [messages, setMessages] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  // New message modal state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newMsgData, setNewMsgData] = useState({ subject: '', message: '', orderId: '' });
  const [newMsgLoading, setNewMsgLoading] = useState(false);

  const chatContainerRef = useRef(null);
  const selectedMessageRef = useRef(null);

  useEffect(() => {
    selectedMessageRef.current = selectedMessage;
  }, [selectedMessage]);

  const scrollToBottom = (behavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  const fetchMessages = useCallback((keepSelectedId = null) => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((authData) => {
        if (!authData.success || !authData.user) {
          setIsGuest(true);
          setLoading(false);
          return;
        }
        setIsGuest(false);

        fetch(`/api/messages?_t=${Date.now()}`, { cache: 'no-store' })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.messages) {
              const fetchedOrders = data.orders || [];
              setOrders(fetchedOrders);

              const sorted = data.messages.sort((a, b) => {
                const timeA =
                  a.replies?.length > 0
                    ? new Date(a.replies[a.replies.length - 1].createdAt).getTime()
                    : new Date(a.createdAt).getTime();
                const timeB =
                  b.replies?.length > 0
                    ? new Date(b.replies[b.replies.length - 1].createdAt).getTime()
                    : new Date(b.createdAt).getTime();
                return timeB - timeA;
              });

              setMessages(sorted);

              // Context resolution: check keepSelectedId or queryOrderId
              const targetId = keepSelectedId || selectedMessageRef.current?._id;
              if (targetId && !targetId.startsWith('new-order-')) {
                const found = sorted.find((m) => m._id === targetId);
                if (found) setSelectedMessage(found);
              } else if (queryOrderId && !selectedMessageRef.current) {
                // Look for existing thread for this order
                const existingOrderThread = sorted.find(
                  (m) => (m.order?._id || m.order) === queryOrderId
                );
                if (existingOrderThread) {
                  setSelectedMessage(existingOrderThread);
                } else {
                  // Initialize draft for this order
                  const matchingOrder = fetchedOrders.find((o) => o._id === queryOrderId);
                  setSelectedMessage({
                    _id: 'new-order-' + queryOrderId,
                    isNewOrder: true,
                    order: matchingOrder || { _id: queryOrderId, service: 'Custom Order' },
                    subject: `Order #${queryOrderId.slice(-6)} - ${matchingOrder?.service || 'Service Discussion'}`,
                    replies: [],
                    createdAt: new Date(),
                  });
                }
              } else if (sorted.length > 0 && !selectedMessageRef.current) {
                setSelectedMessage(sorted[0]);
              }
            }
          })
          .finally(() => setLoading(false));
      })
      .catch(() => {
        setIsGuest(true);
        setLoading(false);
      });
  }, [queryOrderId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 4000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Inner container scroll
  useEffect(() => {
    if (selectedMessage?._id) {
      setTimeout(() => scrollToBottom('auto'), 50);
    }
  }, [selectedMessage?._id]);

  useEffect(() => {
    if (selectedMessage?.replies?.length) {
      setTimeout(() => scrollToBottom('smooth'), 50);
    }
  }, [selectedMessage?.replies?.length]);

  const handleSelectMessage = async (msg) => {
    setSelectedMessage(msg);
    if (msg.readByCustomer === false && !msg.isNewOrder) {
      try {
        await fetch(`/api/messages/${msg._id}/read`, { method: 'PATCH' });
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, readByCustomer: true } : m))
        );
      } catch {}
    }
  };

  const handleStartOrderChat = (ord) => {
    // Check if thread already exists for this order
    const existing = messages.find((m) => (m.order?._id || m.order) === ord._id);
    if (existing) {
      handleSelectMessage(existing);
    } else {
      setSelectedMessage({
        _id: 'new-order-' + ord._id,
        isNewOrder: true,
        order: ord,
        subject: `Order #${ord._id.slice(-6)} - ${ord.service}`,
        replies: [],
        createdAt: new Date(),
      });
    }
  };

  const handleSendReply = async (e) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !selectedMessage || sending) return;

    setSending(true);
    const textToSend = replyText.trim();
    setReplyText('');

    try {
      if (selectedMessage.isNewOrder) {
        // First message for this order -> calls POST /api/messages
        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: selectedMessage.order._id,
            message: textToSend,
            subject: selectedMessage.subject,
          }),
        });

        const data = await res.json();
        if (data.success && data.message) {
          setSelectedMessage(data.message);
          setMessages((prev) => [data.message, ...prev.filter((m) => m._id !== data.message._id)]);
          fetchMessages(data.message._id);
        } else {
          alert(data.error || 'Failed to start order conversation');
        }
      } else {
        // Existing thread -> calls POST /api/messages/[id]/reply
        const res = await fetch(`/api/messages/${selectedMessage._id}/reply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textToSend }),
        });

        const data = await res.json();
        if (data.success && data.message) {
          setSelectedMessage(data.message);
          setMessages((prev) => {
            const others = prev.filter((m) => m._id !== data.message._id);
            return [data.message, ...others];
          });
          fetchMessages(data.message._id);
        } else {
          alert(data.error || 'Failed to send reply');
        }
      }
    } catch (err) {
      alert('Error sending message: ' + (err.message || 'Please check your connection and try again.'));
    } finally {
      setSending(false);
      setTimeout(() => scrollToBottom('smooth'), 50);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  const handleCreateNewMessage = async (e) => {
    e.preventDefault();
    setNewMsgLoading(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: newMsgData.subject,
          message: newMsgData.message,
          orderId: newMsgData.orderId || null,
        }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        setIsNewModalOpen(false);
        setNewMsgData({ subject: '', message: '', orderId: '' });
        setSelectedMessage(data.message);
        setMessages((prev) => [data.message, ...prev.filter((m) => m._id !== data.message._id)]);
        fetchMessages(data.message._id);
      } else {
        alert(data.error || 'Failed to submit message.');
      }
    } catch {
      alert('Error submitting message. Please try again.');
    } finally {
      setNewMsgLoading(false);
    }
  };

  // Helper for WhatsApp-style chat list item preview
  const getChatPreview = (msg) => {
    if (msg.replies && msg.replies.length > 0) {
      const lastReply = msg.replies[msg.replies.length - 1];
      const isMe = lastReply.sender === 'customer';
      return {
        text: isMe ? `You: ${lastReply.text}` : `Muhammad Zakarya: ${lastReply.text}`,
        time: new Date(lastReply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe,
      };
    }
    return {
      text: `You: ${msg.message || 'Started conversation'}`,
      time: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      isMe: true,
    };
  };

  // Orders that don't yet have active conversations
  const ordersWithoutChat = orders.filter(
    (ord) => !messages.some((m) => (m.order?._id || m.order) === ord._id)
  );

  if (isGuest) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-[#0a0e19] p-6 sm:p-12 text-center max-w-lg mx-auto space-y-6 shadow-2xl my-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 mx-auto border border-blue-500/30">
          <LogIn className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Authentication Required</h2>
          <p className="text-sm text-slate-300">
            You must create an account or login to send messages.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-6 py-2.5 text-xs font-semibold text-white hover:opacity-95 transition-all shadow-lg shadow-cyan-500/20"
          >
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-full border border-purple-500/30 bg-[#120934] px-6 py-2.5 text-xs font-semibold text-slate-200 hover:bg-[#180d45] hover:text-white transition-all"
          >
            <UserPlus className="h-4 w-4" />
            <span>Create Account</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-500/20 pb-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 break-words">
            <MessageSquare className="h-5 w-5 text-cyan-400 shrink-0" />
            <span>Messages with Muhammad Zakarya</span>
          </h1>
          <p className="text-xs text-purple-200/70">
            Unified communication for General inquiries and Order-specific consultations.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => fetchMessages()}
            className="rounded-full border border-purple-500/30 bg-[#120934] p-2.5 text-slate-400 hover:text-white hover:border-cyan-400/50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-4 py-2.5 text-xs font-semibold text-white hover:opacity-95 transition-all shadow-lg shadow-cyan-500/25"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-purple-300">Loading conversations...</div>
      ) : messages.length === 0 && !selectedMessage?.isNewOrder ? (
        <div className="rounded-3xl border border-purple-500/30 bg-[#0d0725] p-6 sm:p-12 text-center space-y-4 shadow-2xl">
          <MessageSquare className="h-12 w-12 text-purple-400/50 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Messages Yet</h3>
          <p className="text-sm text-purple-200/70 max-w-sm mx-auto">
            Need consultation, project updates, or have questions for Muhammad Zakarya?
          </p>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-6 py-2.5 text-xs font-semibold text-white hover:opacity-95 transition-all shadow-lg shadow-cyan-500/25"
          >
            <Plus className="h-4 w-4" />
            <span>Start a Conversation</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-3xl border border-purple-500/30 bg-[#0d0725] overflow-hidden min-h-[640px] shadow-2xl">
          
          {/* ================= LEFT: WHATSAPP-STYLE CHAT LIST ================= */}
          <div className="lg:col-span-5 border-r border-purple-500/20 bg-[#0d0725] flex flex-col">
            <div className="p-3.5 border-b border-purple-500/20 bg-[#120934]/90 flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                Conversations ({messages.length + (selectedMessage?.isNewOrder ? 1 : 0)})
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
              
              {/* Draft Order conversation if active */}
              {selectedMessage?.isNewOrder && (
                <div
                  className="p-3.5 flex items-start gap-3 cursor-pointer bg-[#0f172a] border-l-4 border-purple-500"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-xs font-bold text-white shadow-md">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white truncate">
                        Order #{selectedMessage.order?._id?.slice(-6)}
                      </span>
                      <span className="text-[10px] font-mono text-purple-400 shrink-0">New Chat</span>
                    </div>
                    <div className="text-[11px] text-purple-300 font-medium truncate mt-0.5">
                      {selectedMessage.order?.service}
                    </div>
                    <p className="text-[11px] text-slate-400 italic truncate mt-1">
                      Ready to send first message...
                    </p>
                  </div>
                </div>
              )}

              {/* Active message threads */}
              {messages.map((msg) => {
                const isSelected = selectedMessage?._id === msg._id;
                const preview = getChatPreview(msg);
                const isUnread = msg.readByCustomer === false;
                const isOrderChat = !!msg.order;

                return (
                  <div
                    key={msg._id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? isOrderChat
                          ? 'bg-[#18112c] border-l-4 border-purple-500'
                          : 'bg-[#0f172a] border-l-4 border-blue-500'
                        : 'hover:bg-slate-900/60'
                    }`}
                  >
                    {/* Avatar / Context Icon */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-md ${
                        isOrderChat
                          ? 'bg-gradient-to-tr from-purple-600 to-indigo-600'
                          : 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                      }`}
                    >
                      {isOrderChat ? <ShoppingBag className="h-5 w-5" /> : 'MZ'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="text-xs font-bold text-white truncate">
                            {isOrderChat
                              ? `Order #${(msg.order?._id || msg.order).toString().slice(-6)}`
                              : 'General Support'}
                          </span>
                          <span
                            className={`rounded px-1.5 py-0.2 text-[9px] font-mono uppercase font-semibold ${
                              isOrderChat
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {isOrderChat ? 'Order' : 'General'}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">{preview.time}</span>
                      </div>

                      <div className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                        {isOrderChat ? (msg.order?.service || msg.subject) : msg.subject}
                      </div>

                      {/* Last Message Snippet */}
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                          {preview.isMe && <CheckCheck className="h-3.5 w-3.5 text-blue-400 shrink-0" />}
                          <span className="truncate">{preview.text}</span>
                        </p>

                        {isUnread ? (
                          <span className="shrink-0 rounded-full bg-red-600 px-1.5 py-0.2 text-[9px] font-bold text-white shadow-sm animate-pulse">
                            NEW
                          </span>
                        ) : (
                          msg.status === 'replied' && (
                            <span className="shrink-0 text-[10px] text-emerald-400 font-semibold font-mono">
                              Replied
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Quick links to start chats for other orders */}
              {ordersWithoutChat.length > 0 && (
                <div className="p-3 bg-[#0a0e19]/60">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2">
                    Orders Without Chat ({ordersWithoutChat.length})
                  </span>
                  <div className="space-y-1.5">
                    {ordersWithoutChat.map((ord) => (
                      <button
                        key={ord._id}
                        onClick={() => handleStartOrderChat(ord)}
                        className="w-full text-left p-2 rounded-xl border border-slate-800 hover:border-purple-500/40 hover:bg-[#130f24] transition-all flex items-center justify-between text-xs group"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <ShoppingBag className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                          <span className="text-slate-300 font-medium truncate">
                            #{ord._id.slice(-6)} • {ord.service}
                          </span>
                        </div>
                        <span className="text-[10px] text-purple-400 font-mono shrink-0 group-hover:translate-x-0.5 transition-transform">
                          + Message
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

            {/* ================= RIGHT: WHATSAPP-STYLE ACTIVE CHAT ================= */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-[#0a0520]">
            {selectedMessage ? (
              <>
                {/* Chat Top Bar Context Header */}
                <div className="p-3.5 border-b border-purple-500/20 bg-[#120934]/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  {selectedMessage.order ? (
                    // ORDER CONTEXT HEADER
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-xs font-bold text-white shadow-md">
                        <ShoppingBag className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-sm font-bold text-white flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span>KELDORATHAL Support</span>
                          <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
                          <span className="rounded-full bg-purple-500/20 border border-purple-500/40 px-2 py-0.5 text-[10px] font-mono text-purple-300">
                            Order #{(selectedMessage.order._id || selectedMessage.order).toString().slice(-6)}
                          </span>
                        </h2>
                        <p className="text-[11px] text-purple-200/80 font-medium truncate">
                          {selectedMessage.order.service || 'Service Discussion'}
                          {selectedMessage.order.status && (
                            <span className="text-cyan-400 font-mono ml-2">
                              • Status: {selectedMessage.order.status}
                            </span>
                          )}
                          {selectedMessage.order.budget && (
                            <span className="text-purple-300 font-mono ml-2">
                              • Budget: {selectedMessage.order.currency === 'PKR' ? 'Rs' : '$'} {selectedMessage.order.budget}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    // GENERAL CONTEXT HEADER
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-xs font-bold text-white shadow-md">
                        MZ
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-sm font-bold text-white flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span>Muhammad Zakarya</span>
                          <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
                          <span className="rounded-full bg-blue-500/20 border border-blue-500/40 px-2 py-0.5 text-[10px] font-mono text-cyan-300">
                            General Support
                          </span>
                        </h2>
                        <p className="text-[11px] text-purple-200/70 font-medium truncate">
                          Founder & Full-Stack Developer • Direct Inquiries
                        </p>
                      </div>
                    </div>
                  )}

                  <span className="text-[10px] font-mono text-purple-300/60 self-end sm:self-auto shrink-0">
                    {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleDateString() : 'Today'}
                  </span>
                </div>

                {/* Chat Messages Body */}
                <div ref={chatContainerRef} className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-[#0a0520] to-[#0d0725]">
                  
                  {/* Date separator */}
                  <div className="text-center my-2">
                    <span className="rounded-full bg-[#120934] px-3 py-1 text-[10px] font-mono text-purple-300 border border-purple-500/30">
                      {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleDateString() : 'Today'}
                    </span>
                  </div>

                  {/* Empty state for new order context */}
                  {selectedMessage.isNewOrder && selectedMessage.replies?.length === 0 && (
                    <div className="rounded-3xl border border-purple-500/30 bg-[#120934]/50 p-5 sm:p-6 text-center space-y-2 max-w-md mx-auto my-6">
                      <ShoppingBag className="h-8 w-8 text-cyan-400 mx-auto" />
                      <h4 className="text-sm font-bold text-white">
                        Order #{selectedMessage.order?._id?.slice(-6)} Discussion
                      </h4>
                      <p className="text-xs text-purple-200/80">
                        Type your message below to consult with Muhammad Zakarya regarding this specific order.
                      </p>
                    </div>
                  )}

                  {/* Unified Chronological Messages List */}
                  {((selectedMessage.replies && selectedMessage.replies.length > 0)
                    ? selectedMessage.replies
                    : (selectedMessage.message
                        ? [{
                            sender: 'customer',
                            senderName: 'You',
                            text: selectedMessage.message,
                            createdAt: selectedMessage.createdAt,
                          }]
                        : [])
                  ).map((reply, idx) => {
                    const isMe = reply.sender === 'customer';

                    return (
                      <div
                        key={reply._id || idx}
                        className={`flex flex-col ${isMe ? 'items-end ml-auto' : 'items-start mr-auto'} max-w-[92%] sm:max-w-[75%]`}
                      >
                        <div
                          className={`rounded-3xl p-3.5 sm:p-4 space-y-1 shadow-md break-words ${
                            isMe
                              ? 'rounded-tr-md bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border border-blue-500/40 text-blue-100'
                              : 'rounded-tl-md bg-[#160c38]/90 border border-purple-500/40 text-purple-100'
                          }`}
                        >
                          <span className={`text-[10px] font-mono font-bold flex items-center gap-1 ${isMe ? 'text-cyan-300' : 'text-purple-300'}`}>
                            {!isMe && <ShieldCheck className="h-3 w-3 text-cyan-400 shrink-0" />}
                            <span>{isMe ? 'You' : reply.senderName}</span>
                          </span>

                          <p className="text-xs whitespace-pre-line leading-relaxed break-words">
                            {reply.text}
                          </p>

                          <div className="flex items-center justify-end gap-1 text-[9px] font-mono text-purple-300/60 mt-1">
                            <span>
                              {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMe && <CheckCheck className="h-3.5 w-3.5 text-cyan-400 shrink-0" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                </div>

                {/* WhatsApp-Style Input Bar */}
                <form
                  onSubmit={handleSendReply}
                  className="p-2.5 sm:p-3.5 border-t border-purple-500/20 bg-[#120934]/90 flex items-center gap-2"
                >
                  <input
                    type="text"
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      selectedMessage.order
                        ? `Message Muhammad Zakarya about Order #${(selectedMessage.order._id || selectedMessage.order).toString().slice(-6)}...`
                        : 'Type your message (Press Enter to send)...'
                    }
                    className="flex-1 rounded-full border border-purple-500/30 bg-[#070318] px-4 py-2.5 sm:px-5 sm:py-3 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-cyan-400 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={sending || !replyText.trim()}
                    className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-95 disabled:opacity-40 transition-all shadow-lg shadow-cyan-500/30 hover:scale-105"
                    title="Send Message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 p-8 text-center text-purple-300/50">
                <MessageSquare className="h-12 w-12 text-purple-500/30 mb-2" />
                <p className="text-sm">Select a conversation from the left to start messaging.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* NEW MESSAGE MODAL */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-purple-500/30 bg-[#0d0725] p-5 sm:p-7 space-y-5 shadow-2xl">
            <button
              onClick={() => setIsNewModalOpen(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 text-purple-300 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-bold text-white break-words">Start Conversation with Muhammad Zakarya</h3>

            <form onSubmit={handleCreateNewMessage} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-purple-200 mb-1.5">Conversation Context</label>
                <select
                  value={newMsgData.orderId}
                  onChange={(e) => {
                    const ordId = e.target.value;
                    const matched = orders.find((o) => o._id === ordId);
                    setNewMsgData({
                      ...newMsgData,
                      orderId: ordId,
                      subject: ordId
                        ? `Order #${ordId.slice(-6)} - ${matched?.service || 'Service'}`
                        : '',
                    });
                  }}
                  className="w-full rounded-2xl border border-purple-500/30 bg-[#070318] px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                >
                  <option value="">General Support / Consultation</option>
                  {orders.map((ord) => (
                    <option key={ord._id} value={ord._id}>
                      Order #{ord._id.slice(-6)} — {ord.service} ({ord.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-purple-200 mb-1.5">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Project Inquiry or Order Clarification"
                  value={newMsgData.subject}
                  onChange={(e) => setNewMsgData({ ...newMsgData, subject: e.target.value })}
                  className="w-full rounded-2xl border border-purple-500/30 bg-[#070318] px-4 py-2.5 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-purple-200 mb-1.5">Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Type your message..."
                  value={newMsgData.message}
                  onChange={(e) => setNewMsgData({ ...newMsgData, message: e.target.value })}
                  className="w-full rounded-2xl border border-purple-500/30 bg-[#070318] px-4 py-2.5 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div className="pt-3 flex flex-col-reverse sm:flex-row justify-end gap-2.5 border-t border-purple-500/20">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="w-full sm:w-auto rounded-full border border-purple-500/30 bg-[#120934] px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={newMsgLoading}
                  className="w-full sm:w-auto rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-6 py-2.5 text-xs font-semibold text-white hover:opacity-95 disabled:opacity-50 transition-all shadow-lg shadow-cyan-500/20 text-center"
                >
                  {newMsgLoading ? 'Starting Chat...' : 'Start Chat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomerMessagesPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-xs font-mono text-slate-400">Loading messenger...</div>}>
      <CustomerMessagesContent />
    </Suspense>
  );
}
