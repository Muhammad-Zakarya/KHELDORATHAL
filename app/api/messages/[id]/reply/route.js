import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import Order from '@/models/Order';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req, context) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const id = params?.id;
    const { text } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ success: false, error: 'Reply text cannot be empty.' }, { status: 400 });
    }

    await dbConnect();

    const existingMessage = await Message.findById(id);
    if (!existingMessage) {
      return NextResponse.json({ success: false, error: 'Message thread not found.' }, { status: 404 });
    }

    const isCustomer = session.role === 'customer';
    if (isCustomer) {
      if (
        existingMessage.email.toLowerCase() !== session.email.toLowerCase() &&
        existingMessage.user?.toString() !== session.id
      ) {
        return NextResponse.json({ success: false, error: 'Unauthorized access to this thread.' }, { status: 403 });
      }

      if (existingMessage.order) {
        const order = await Order.findById(existingMessage.order);
        if (order && order.customer.toString() !== session.id) {
          return NextResponse.json({ success: false, error: 'Unauthorized access to this order conversation.' }, { status: 403 });
        }
      }
    }

    const now = new Date();
    const newReply = {
      sender: session.role === 'admin' ? 'admin' : 'customer',
      senderName: session.role === 'admin' ? 'Muhammad Zakarya (Admin)' : session.name,
      text: text.trim(),
      createdAt: now,
    };

    let updatedMessage;
    if (existingMessage.message && (!existingMessage.replies || existingMessage.replies.length === 0)) {
      const initialReply = {
        sender: 'customer',
        senderName: existingMessage.name || 'Customer',
        text: existingMessage.message,
        read: true,
        createdAt: existingMessage.createdAt || now,
      };
      updatedMessage = await Message.findByIdAndUpdate(
        id,
        {
          $set: {
            replies: [initialReply, newReply],
            status: session.role === 'admin' ? 'replied' : 'unread',
            readByAdmin: session.role === 'admin' ? true : false,
            readByCustomer: session.role === 'admin' ? false : true,
            updatedAt: now,
          },
        },
        { returnDocument: 'after' }
      );
    } else {
      updatedMessage = await Message.findByIdAndUpdate(
        id,
        {
          $push: { replies: newReply },
          $set: {
            status: session.role === 'admin' ? 'replied' : 'unread',
            readByAdmin: session.role === 'admin' ? true : false,
            readByCustomer: session.role === 'admin' ? false : true,
            updatedAt: now,
          },
        },
        { returnDocument: 'after' }
      );
    }

    const populated = await Message.findById(updatedMessage._id)
      .populate('order', 'service projectTitle status budget currency')
      .populate('user', 'name email role');
    const updatedObj = populated ? populated.toObject() : (updatedMessage.toObject ? updatedMessage.toObject() : updatedMessage);
    let replies = Array.isArray(updatedObj.replies) ? [...updatedObj.replies] : [];
    if (updatedObj.message && (replies.length === 0 || !replies.some(r => r.text === updatedObj.message && r.sender === 'customer'))) {
      replies.unshift({
        sender: 'customer',
        senderName: updatedObj.name || 'Customer',
        text: updatedObj.message,
        read: true,
        createdAt: updatedObj.createdAt,
      });
    }
    replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    updatedObj.replies = replies;

    return NextResponse.json({ success: true, message: updatedObj });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
