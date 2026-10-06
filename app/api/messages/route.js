import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import Order from '@/models/Order';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
  try {
    const session = await getSession();
    const body = await req.json();
    const { name, email, subject, message, text, orderId, customerId } = body;
    const messageText = (message || text || '').trim();

    if (!session) {
      // Guest sending message to founder/admin
      if (orderId) {
        return NextResponse.json(
          { success: false, error: 'Guests cannot create order discussions. Please login or register.' },
          { status: 403 }
        );
      }

      const guestName = (name || '').trim();
      const guestEmail = (email || '').trim().toLowerCase();

      if (!guestName) {
        return NextResponse.json(
          { success: false, error: 'Please provide your name.' },
          { status: 400 }
        );
      }

      if (!guestEmail || !guestEmail.includes('@') || !guestEmail.includes('.')) {
        return NextResponse.json(
          { success: false, error: 'Please provide a valid email address.' },
          { status: 400 }
        );
      }

      if (!messageText) {
        return NextResponse.json(
          { success: false, error: 'Message cannot be empty.' },
          { status: 400 }
        );
      }

      await dbConnect();
      const now = new Date();
      const guestSubject = (subject || 'General Inquiry with Founder').trim();

      const newReply = {
        sender: 'customer',
        senderName: `${guestName} (Guest)`,
        text: messageText,
        read: false,
        createdAt: now,
      };

      const guestMessage = await Message.create({
        name: guestName,
        email: guestEmail,
        subject: guestSubject,
        message: messageText,
        senderType: 'guest',
        user: null,
        order: null,
        status: 'unread',
        readByAdmin: false,
        readByCustomer: false,
        replies: [newReply],
      });

      return NextResponse.json({
        success: true,
        message: 'Your message has been sent successfully. We will get back to you soon.',
        id: guestMessage._id,
      });
    }

    if (!messageText) {
      return NextResponse.json(
        { success: false, error: 'Message cannot be empty.' },
        { status: 400 }
      );
    }

    await dbConnect();
    const now = new Date();

    let conversation;

    if (session.role === 'customer') {
      let order = null;
      if (orderId) {
        order = await Order.findById(orderId);
        if (!order || order.customer.toString() !== session.id) {
          return NextResponse.json(
            { success: false, error: 'Unauthorized: You do not own this order.' },
            { status: 403 }
          );
        }
      }

      const query = order
        ? { user: session.id, order: order._id }
        : { user: session.id, order: null };

      const threadSubject = order
        ? `Order #${order._id.toString().slice(-6)} - ${order.service}`
        : (subject || 'General Support with Muhammad Zakarya');

      const newReply = {
        sender: 'customer',
        senderName: session.name,
        text: messageText,
        read: false,
        createdAt: now,
      };

      conversation = await Message.findOne(query).sort({ updatedAt: -1 });

      if (conversation) {
        conversation = await Message.findByIdAndUpdate(
          conversation._id,
          {
            $push: { replies: newReply },
            $set: {
              status: 'unread',
              readByAdmin: false,
              readByCustomer: true,
              updatedAt: now,
              ...(order && !conversation.order ? { order: order._id } : {}),
            },
          },
          { returnDocument: 'after' }
        ).populate('order', 'service projectTitle status budget currency');
      } else {
        conversation = await Message.create({
          name: session.name,
          email: session.email.toLowerCase(),
          subject: threadSubject,
          message: messageText,
          senderType: 'customer',
          user: session.id,
          order: order ? order._id : null,
          status: 'unread',
          readByAdmin: false,
          readByCustomer: true,
          replies: [newReply],
        });
        conversation = await Message.findById(conversation._id).populate('order', 'service projectTitle status budget currency');
      }
    } else if (session.role === 'admin') {
      if (!customerId) {
        return NextResponse.json(
          { success: false, error: 'Target customer ID is required.' },
          { status: 400 }
        );
      }

      const targetCustomer = await User.findById(customerId);
      if (!targetCustomer || targetCustomer.role !== 'customer') {
        return NextResponse.json(
          { success: false, error: 'Target customer not found or invalid.' },
          { status: 404 }
        );
      }

      let order = null;
      if (orderId) {
        order = await Order.findById(orderId);
        if (!order || order.customer.toString() !== targetCustomer._id.toString()) {
          return NextResponse.json(
            { success: false, error: 'Order does not belong to this customer.' },
            { status: 400 }
          );
        }
      }

      const query = order
        ? { user: targetCustomer._id, order: order._id }
        : { user: targetCustomer._id, order: null };

      const threadSubject = order
        ? `Order #${order._id.toString().slice(-6)} - ${order.service}`
        : (subject || 'Direct Support with Muhammad Zakarya');

      const newReply = {
        sender: 'admin',
        senderName: 'Muhammad Zakarya (Admin)',
        text: messageText,
        read: false,
        createdAt: now,
      };

      conversation = await Message.findOne(query).sort({ updatedAt: -1 });

      if (conversation) {
        conversation = await Message.findByIdAndUpdate(
          conversation._id,
          {
            $push: { replies: newReply },
            $set: {
              status: 'replied',
              readByAdmin: true,
              readByCustomer: false,
              updatedAt: now,
              ...(order && !conversation.order ? { order: order._id } : {}),
            },
          },
          { returnDocument: 'after' }
        ).populate('order', 'service projectTitle status budget currency');
      } else {
        conversation = await Message.create({
          name: targetCustomer.name,
          email: targetCustomer.email.toLowerCase(),
          subject: threadSubject,
          message: messageText,
          senderType: 'customer',
          user: targetCustomer._id,
          order: order ? order._id : null,
          status: 'replied',
          readByAdmin: true,
          readByCustomer: false,
          replies: [newReply],
        });
        conversation = await Message.findById(conversation._id).populate('order', 'service projectTitle status budget currency');
      }
    } else {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const convObj = conversation.toObject ? conversation.toObject() : conversation;
    let replies = Array.isArray(convObj.replies) ? [...convObj.replies] : [];
    if (convObj.message && (replies.length === 0 || !replies.some(r => r.text === convObj.message && r.sender === 'customer'))) {
      replies.unshift({
        sender: 'customer',
        senderName: convObj.name || 'Customer',
        text: convObj.message,
        read: true,
        createdAt: convObj.createdAt,
      });
    }
    replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    convObj.replies = replies;

    return NextResponse.json({ success: true, message: convObj });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    if (session.role === 'admin') {
      const rawMessages = await Message.find({})
        .populate('order', 'service projectTitle status budget currency')
        .populate('user', 'name email role')
        .sort({ updatedAt: -1, createdAt: -1 })
        .lean();

      const messages = rawMessages.map((m) => {
        let replies = Array.isArray(m.replies) ? [...m.replies] : [];
        if (m.message && (replies.length === 0 || !replies.some(r => r.text === m.message && r.sender === 'customer'))) {
          replies.unshift({
            sender: 'customer',
            senderName: m.name || 'Customer',
            text: m.message,
            read: true,
            createdAt: m.createdAt,
          });
        }
        replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        return {
          ...m,
          status: m.status || (m.readByAdmin === false ? 'unread' : 'read'),
          replies,
        };
      });

      const customers = await User.find({ role: 'customer' })
        .select('name email createdAt')
        .sort({ name: 1 })
        .lean();

      const orders = await Order.find({})
        .populate('customer', 'name email')
        .select('customer service projectTitle status budget currency createdAt')
        .sort({ createdAt: -1 })
        .lean();

      const unreadCount = await Message.countDocuments({
        $or: [
          { readByAdmin: false },
          { status: 'unread' },
        ],
      });

      return NextResponse.json(
        { success: true, messages, customers, orders, unreadCount },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    } else {
      // Customer: find messages associated with their user id or email
      const customerQuery = {
        $or: [{ user: session.id }, { email: session.email.toLowerCase() }],
      };
      const rawMessages = await Message.find(customerQuery)
        .populate('order', 'service projectTitle status budget currency')
        .sort({ updatedAt: -1, createdAt: -1 })
        .lean();

      const messages = rawMessages.map((m) => {
        let replies = Array.isArray(m.replies) ? [...m.replies] : [];
        if (m.message && (replies.length === 0 || !replies.some(r => r.text === m.message && r.sender === 'customer'))) {
          replies.unshift({
            sender: 'customer',
            senderName: m.name || 'Customer',
            text: m.message,
            read: true,
            createdAt: m.createdAt,
          });
        }
        replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        return {
          ...m,
          status: m.status || 'unread',
          replies,
        };
      });

      const orders = await Order.find({ customer: session.id })
        .select('service projectTitle status budget currency createdAt')
        .sort({ createdAt: -1 })
        .lean();

      const unreadCount = await Message.countDocuments({
        ...customerQuery,
        readByCustomer: false,
      });

      return NextResponse.json(
        { success: true, messages, orders, unreadCount },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' } }
      );
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
