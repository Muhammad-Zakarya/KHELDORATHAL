'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  MessageSquare,
  Send,
  CheckCheck,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Users,
  Search,
} from 'lucide-react';

function AdminMessagesContent() {
  const searchParams = useSearchParams();
  const queryCustomerId = searchParams.get('customerId');
  const queryOrderId = searchParams.get('orderId');

  const [messages, setMessages] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' | 'customers'
  const [searchQuery, setSearchQuery] = useState('');

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
    fetch(`/api/messages?_t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const fetchedMessages = data.messages || [];
          const fetchedCustomers = data.customers || [];
          const fetchedOrders = data.orders || [];

          setCustomers(fetchedCustomers);

          const sorted = fetchedMessages.sort((a, b) => {
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

          // Handle selection priority
          const targetId = keepSelectedId || selectedMessageRef.current?._id;
          if (targetId && !targetId.startsWith('new-admin-chat-')) {
            const found = sorted.find((m) => m._id === targetId);
            if (found) setSelectedMessage(found);
          } else if ((queryCustomerId || queryOrderId) && !selectedMessageRef.current) {
            // Check if thread exists for this query
            let matched = null;
            if (queryOrderId) {
              matched = sorted.find((m) => (m.order?._id || m.order) === queryOrderId);
            } else if (queryCustomerId) {
              matched = sorted.find(
                (m) => (m.user?._id || m.user) === queryCustomerId && !m.order
              );
            }

            if (matched) {
              setSelectedMessage(matched);
            } else {
              // Create draft context for Admin -> Customer/Order
              const targetCustomer = fetchedCustomers.find((c) => c._id === queryCustomerId);
              const targetOrder = queryOrderId ? fetchedOrders.find((o) => o._id === queryOrderId) : null;
              const customerName = targetCustomer?.name || targetOrder?.customer?.name || 'Customer';
              const customerEmail = targetCustomer?.email || targetOrder?.customer?.email || '';

              setSelectedMessage({
                _id: 'new-admin-chat-' + (queryCustomerId || '') + (queryOrderId ? '-' + queryOrderId : ''),
                isNewAdminChat: true,
                targetCustomerId: queryCustomerId || targetOrder?.customer?._id,
                customer: targetCustomer || targetOrder?.customer,
                order: targetOrder,
                name: customerName,
                email: customerEmail,
                subject: targetOrder
                  ? `Order #${queryOrderId.slice(-6)} - ${targetOrder.service}`
                  : 'Direct Support with Muhammad Zakarya',
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
  }, [queryCustomerId, queryOrderId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 4000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

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
    if (!msg.isNewAdminChat && (msg.status === 'unread' || msg.readByAdmin === false)) {
      try {
        await fetch(`/api/messages/${msg._id}/read`, { method: 'PATCH' });
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, status: 'read', readByAdmin: true } : m))
        );
      } catch {}
    }
  };

  const handleSelectCustomerForChat = (cust) => {
    // Check if general thread already exists for this customer
    const existing = messages.find((m) => (m.user?._id || m.user) === cust._id && !m.order);
    if (existing) {
      handleSelectMessage(existing);
      setActiveTab('chats');
    } else {
      setSelectedMessage({
        _id: 'new-admin-chat-' + cust._id,
        isNewAdminChat: true,
        targetCustomerId: cust._id,
        customer: cust,
        order: null,
        name: cust.name,
        email: cust.email,
        subject: 'Direct Support with Muhammad Zakarya',
        replies: [],
        createdAt: new Date(),
      });
      setActiveTab('chats');
    }
  };

  const handleSendReply = async (e) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !selectedMessage || sending) return;

    setSending(true);
    const textToSend = replyText.trim();
    setReplyText('');

    try {
      if (selectedMessage.isNewAdminChat) {
        // Admin initiating conversation -> calls POST /api/messages
        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerId: selectedMessage.targetCustomerId,
            orderId: selectedMessage.order?._id || null,
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
          alert(data.error || 'Failed to initiate conversation.');
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
          alert(data.error || 'Message could not be sent. Please try again.');
        }
      }
    } catch (err) {
      alert('Message could not be sent. Please try again: ' + (err.message || 'Network error'));
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

  // Helper to get WhatsApp-style snippet for chat list item
  const getChatPreview = (msg) => {
    if (msg.replies && msg.replies.length > 0) {
      const lastReply = msg.replies[msg.replies.length - 1];
      const isMe = lastReply.sender === 'admin';
      return {
        text: isMe ? `You: ${lastReply.text}` : lastReply.text,
        time: new Date(lastReply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe,
      };
    }
    return {
      text: msg.message || 'Started conversation',
      time: msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      isMe: false,
    };
  };

  // Filter messages according to search
  const filteredMessages = messages.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const orderNum = (m.order?._id || m.order || '').toString().slice(-6);
    return (
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q) ||
      m.order?.service?.toLowerCase().includes(q) ||
      orderNum.includes(q)
    );
  });

  // Filter registered customers
  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 break-words">
            <MessageSquare className="h-5 w-5 text-purple-400 shrink-0" />
            <span>Customer Messages & Live Chat</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time messaging for General Inquiries and Order Discussions with all registered clients.
          </p>
        </div>
        <button
          onClick={() => fetchMessages()}
          className="self-start sm:self-auto rounded-xl border border-slate-800 bg-[#0a0e19] p-2 text-slate-400 hover:text-white transition-colors shrink-0"
          title="Refresh Messages"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-slate-400">Loading conversation threads...</div>
      ) : messages.length === 0 && !selectedMessage?.isNewAdminChat ? (
        <div className="rounded-2xl border border-slate-800 bg-[#0a0e19] p-12 text-center text-slate-400 text-sm space-y-4">
          <MessageSquare className="h-12 w-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Messages Received Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You can message any registered customer directly below.
          </p>
          <button
            onClick={() => setActiveTab('customers')}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-purple-500 transition-all shadow-md shadow-purple-600/30"
          >
            <Users className="h-4 w-4" />
            <span>View Registered Customers</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-3xl border border-purple-500/30 bg-[#0d0725] overflow-hidden min-h-[640px] shadow-2xl">
          
          {/* ================= LEFT: WHATSAPP-STYLE CHAT LIST & CUSTOMERS ================= */}
          <div className="lg:col-span-5 border-r border-purple-500/20 bg-[#0d0725] flex flex-col">
            
            {/* Tab switch bar */}
            <div className="p-3 border-b border-purple-500/20 bg-[#120934]/90 flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('chats')}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                  activeTab === 'chats'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'text-purple-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Chats ({messages.length})
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                className={`flex-1 py-2 px-3 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                  activeTab === 'customers'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'text-purple-300 hover:text-white hover:bg-white/5'
                }`}
              >
                All Customers ({customers.length})
              </button>
            </div>

            {/* Search filter input */}
            <div className="p-3 border-b border-purple-500/20 bg-[#0c0525]">
              <div className="relative">
                <Search className="h-3.5 w-3.5 text-purple-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder={activeTab === 'chats' ? 'Filter chats or orders...' : 'Search registered customers...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-purple-500/30 bg-[#070318] pl-9 pr-4 py-2 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
              
              {/* TAB 1: ALL ACTIVE CONVERSATION THREADS */}
              {activeTab === 'chats' && (
                <>
                  {/* Draft context for new admin chat if active */}
                  {selectedMessage?.isNewAdminChat && (
                    <div className="p-3.5 flex items-start gap-3 cursor-pointer bg-[#150f28] border-l-4 border-purple-500">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-sm font-bold text-white shadow-md">
                        {selectedMessage.name ? selectedMessage.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-white truncate">{selectedMessage.name}</span>
                          <span className="text-[10px] font-mono text-purple-400 shrink-0">New Chat</span>
                        </div>
                        <div className="text-[11px] text-purple-300 font-medium truncate mt-0.5">
                          {selectedMessage.subject}
                        </div>
                        <p className="text-[11px] text-slate-400 italic truncate mt-1">
                          Drafting initial message...
                        </p>
                      </div>
                    </div>
                  )}

                  {filteredMessages.map((msg) => {
                    const isSelected = selectedMessage?._id === msg._id;
                    const preview = getChatPreview(msg);
                    const isUnread = msg.readByAdmin === false || msg.status === 'unread';
                    const isOrderChat = !!msg.order;
                    const isGuest = msg.senderType === 'guest' || (!msg.user && !isOrderChat);

                    return (
                      <div
                        key={msg._id}
                        onClick={() => handleSelectMessage(msg)}
                        className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#150f28] border-l-4 border-purple-500'
                            : 'hover:bg-slate-900/60'
                        }`}
                      >
                        {/* User Avatar Initial / Order Icon */}
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md ${
                            isOrderChat
                              ? 'bg-gradient-to-tr from-purple-600 to-indigo-600'
                              : isGuest
                              ? 'bg-gradient-to-tr from-amber-600 to-orange-600'
                              : 'bg-gradient-to-tr from-indigo-600 to-blue-600'
                          }`}
                        >
                          {isOrderChat ? (
                            <ShoppingBag className="h-5 w-5" />
                          ) : (
                            msg.name ? msg.name.charAt(0).toUpperCase() : 'C'
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="text-xs font-bold text-white truncate">{msg.name}</span>
                              <span
                                className={`rounded px-1.5 py-0.2 text-[9px] font-mono uppercase font-semibold ${
                                  isOrderChat
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                    : isGuest
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                }`}
                              >
                                {isOrderChat
                                  ? `Order #${(msg.order?._id || msg.order).toString().slice(-6)}`
                                  : isGuest
                                  ? 'Guest'
                                  : 'Customer'}
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
                              {preview.isMe && <CheckCheck className="h-3.5 w-3.5 text-purple-400 shrink-0" />}
                              <span className="truncate">{preview.text}</span>
                            </p>

                            {isUnread ? (
                              <span className="shrink-0 rounded-full bg-red-600 px-1.5 py-0.2 text-[9px] font-bold text-white shadow-sm animate-pulse">
                                NEW
                              </span>
                            ) : (
                              msg.status === 'replied' && (
                                <span className="shrink-0 text-[10px] text-purple-400 font-semibold font-mono">
                                  Replied
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}

              {/* TAB 2: ALL REGISTERED CUSTOMERS DIRECT MESSAGING */}
              {activeTab === 'customers' && (
                <div className="p-1">
                  {filteredCustomers.map((cust) => {
                    // Check if customer already has a chat
                    const customerMessages = messages.filter(
                      (m) => (m.user?._id || m.user) === cust._id || m.email?.toLowerCase() === cust.email?.toLowerCase()
                    );
                    const latestMessage = customerMessages[0];
                    const preview = latestMessage ? getChatPreview(latestMessage) : null;

                    return (
                      <div
                        key={cust._id}
                        onClick={() => handleSelectCustomerForChat(cust)}
                        className="p-3 rounded-xl hover:bg-slate-900/60 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-xs font-bold text-white">
                            {cust.name ? cust.name.charAt(0).toUpperCase() : 'C'}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">{cust.name}</div>
                            <div className="text-[10px] text-slate-400 truncate">{cust.email}</div>
                            <div className="text-[11px] text-slate-400 truncate mt-0.5">
                              {preview ? (
                                <span>Last message: &quot;{preview.text}&quot;</span>
                              ) : (
                                <span className="text-slate-500 italic">No messages yet</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="shrink-0 rounded-lg border border-purple-500/30 bg-purple-600/10 px-2.5 py-1 text-[11px] font-semibold text-purple-300 hover:bg-purple-600 hover:text-white transition-all"
                        >
                          Message
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>

          {/* ================= RIGHT: WHATSAPP-STYLE ACTIVE CHAT ================= */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-[#080d1a]">
            {selectedMessage ? (
              <>
                {/* Chat Top Bar Context Header */}
                <div className="p-3.5 border-b border-slate-800 bg-[#0a0e19] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    {(() => {
                      const isSelectedGuest = selectedMessage.senderType === 'guest' || (!selectedMessage.user && !selectedMessage.order);
                      return (
                        <>
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md ${
                              selectedMessage.order
                                ? 'bg-gradient-to-tr from-purple-600 to-indigo-600'
                                : isSelectedGuest
                                ? 'bg-gradient-to-tr from-amber-600 to-orange-600'
                                : 'bg-gradient-to-tr from-indigo-600 to-blue-600'
                            }`}
                          >
                            {selectedMessage.order ? (
                              <ShoppingBag className="h-5 w-5" />
                            ) : (
                              selectedMessage.name ? selectedMessage.name.charAt(0).toUpperCase() : 'C'
                            )}
                          </div>
                          <div className="min-w-0">
                            <h2 className="text-sm font-bold text-white flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <span className="truncate">{selectedMessage.name}</span>
                              <span className="text-[10px] font-normal text-slate-400 break-all">({selectedMessage.email})</span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[9px] font-mono uppercase font-semibold ${
                                  selectedMessage.order
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                    : isSelectedGuest
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                }`}
                              >
                                {selectedMessage.order ? 'Order Chat' : isSelectedGuest ? 'Guest Inquiry' : 'Customer Chat'}
                              </span>
                            </h2>
                            <p className="text-[11px] text-purple-400 font-medium truncate">
                              {selectedMessage.order ? (
                                <span>
                                  Order #{(selectedMessage.order._id || selectedMessage.order).toString().slice(-6)} •{' '}
                                  {selectedMessage.order.service || selectedMessage.subject}
                                  {selectedMessage.order.status && (
                                    <span className="text-emerald-400 ml-2">
                                      (Status: {selectedMessage.order.status})
                                    </span>
                                  )}
                                </span>
                              ) : (
                                <span>Subject: {selectedMessage.subject}</span>
                              )}
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 self-end sm:self-auto shrink-0">
                    {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleDateString() : 'Today'}
                  </span>
                </div>

                {/* Chat Messages Body (Scrollable) */}
                <div ref={chatContainerRef} className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-[#060913] to-[#080d1a]">
                  
                  {/* Date separator */}
                  <div className="text-center my-2">
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-mono text-slate-400 border border-slate-800">
                      {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleDateString() : 'Today'}
                    </span>
                  </div>

                  {/* Empty state for new initiated conversation */}
                  {selectedMessage.isNewAdminChat && selectedMessage.replies?.length === 0 && (
                    <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-5 sm:p-6 text-center space-y-2 max-w-md mx-auto my-6">
                      <MessageSquare className="h-8 w-8 text-purple-400 mx-auto" />
                      <h4 className="text-sm font-bold text-white">
                        Start Conversation with {selectedMessage.name}
                      </h4>
                      <p className="text-xs text-slate-300">
                        {selectedMessage.order
                          ? `Send an update or question regarding Order #${(selectedMessage.order._id || selectedMessage.order).toString().slice(-6)}.`
                          : 'Send a direct message from Muhammad Zakarya to this registered client.'}
                      </p>
                    </div>
                  )}

                  {/* Unified Chronological Messages List */}
                  {((selectedMessage.replies && selectedMessage.replies.length > 0)
                    ? selectedMessage.replies
                    : (selectedMessage.message
                        ? [{
                            sender: 'customer',
                            senderName: selectedMessage.name || 'Customer',
                            text: selectedMessage.message,
                            createdAt: selectedMessage.createdAt,
                          }]
                        : [])
                  ).map((reply, idx) => {
                    const isMe = reply.sender === 'admin';

                    return (
                      <div
                        key={reply._id || idx}
                        className={`flex flex-col ${isMe ? 'items-end ml-auto' : 'items-start mr-auto'} max-w-[92%] sm:max-w-[75%]`}
                      >
                        <div
                          className={`rounded-2xl p-3 sm:p-3.5 space-y-1 shadow-md break-words ${
                            isMe
                              ? 'rounded-tr-sm bg-purple-900/40 border border-purple-500/40 text-purple-100'
                              : 'rounded-tl-sm bg-[#111728] border border-slate-800 text-slate-200'
                          }`}
                        >
                          <span className={`text-[10px] font-mono font-bold flex items-center gap-1 ${isMe ? 'text-purple-300' : 'text-blue-400'}`}>
                            {isMe && <ShieldCheck className="h-3 w-3 text-purple-400 shrink-0" />}
                            <span className="break-words">{isMe ? 'Muhammad Zakarya (Admin)' : (reply.senderName || selectedMessage.name)}</span>
                          </span>

                          <p className="text-xs whitespace-pre-line leading-relaxed break-words">
                            {reply.text}
                          </p>

                          <div className="flex items-center justify-end gap-1 text-[9px] font-mono text-slate-400 mt-1">
                            <span>
                              {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMe && <CheckCheck className="h-3.5 w-3.5 text-purple-400 shrink-0" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                </div>

                {/* WhatsApp-Style Input Bar */}
                <form
                  onSubmit={handleSendReply}
                  className="p-2.5 sm:p-3.5 border-t border-purple-500/20 bg-[#0c0525] flex items-center gap-2"
                >
                  <input
                    type="text"
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      selectedMessage.order
                        ? `Type message to ${selectedMessage.name} about Order #${(selectedMessage.order._id || selectedMessage.order).toString().slice(-6)}...`
                        : `Type message to ${selectedMessage.name} (Press Enter to send)...`
                    }
                    className="flex-1 rounded-full border border-purple-500/30 bg-[#070318] px-4 py-2.5 sm:px-5 sm:py-3 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all"
                  />
                  <button
                    type="submit"
                    disabled={sending || !replyText.trim()}
                    className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:scale-105 disabled:opacity-40 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                    title="Send Message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 p-8 text-center text-slate-500">
                <MessageSquare className="h-12 w-12 text-slate-700 mb-2" />
                <p className="text-sm">Select a conversation or customer from the left to start messaging.</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

export default function AdminMessagesPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-xs font-mono text-slate-400">Loading admin messenger...</div>}>
      <AdminMessagesContent />
    </Suspense>
  );
}
