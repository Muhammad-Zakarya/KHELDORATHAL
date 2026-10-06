import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import Order from '@/models/Order';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(req, context) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const id = params?.id;
    await dbConnect();

    const existingMessage = await Message.findById(id);
    if (!existingMessage) {
      return NextResponse.json({ success: false, error: 'Message thread not found' }, { status: 404 });
    }

    if (session.role === 'admin') {
      const updateFields = { readByAdmin: true };
      if (existingMessage.status === 'unread') {
        updateFields.status = 'read';
      }
      const updated = await Message.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { returnDocument: 'after' }
      );
      return NextResponse.json({ success: true, message: updated });
    } else if (session.role === 'customer') {
      if (
        existingMessage.email.toLowerCase() !== session.email.toLowerCase() &&
        existingMessage.user?.toString() !== session.id
      ) {
        return NextResponse.json({ success: false, error: 'Unauthorized access to this thread' }, { status: 403 });
      }

      if (existingMessage.order) {
        const order = await Order.findById(existingMessage.order);
        if (order && order.customer.toString() !== session.id) {
          return NextResponse.json({ success: false, error: 'Unauthorized access to this order conversation' }, { status: 403 });
        }
      }

      const updated = await Message.findByIdAndUpdate(
        id,
        { $set: { readByCustomer: true } },
        { returnDocument: 'after' }
      );
      return NextResponse.json({ success: true, message: updated });
    } else {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
