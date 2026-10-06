import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    let orders;
    if (session.role === 'admin') {
      orders = await Order.find({}).populate('customer', 'name email').sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ customer: session.id }).sort({ createdAt: -1 });
    }

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'You must be logged in to place an order.' }, { status: 401 });
    }

    const data = await req.json();
    const { service, projectTitle, description, budget, currency, deadline } = data;

    if (!service || !projectTitle || !description || !budget) {
      return NextResponse.json(
        { success: false, error: 'Please fill in all required order fields.' },
        { status: 400 }
      );
    }

    await dbConnect();

    const order = await Order.create({
      customer: session.id,
      service,
      projectTitle,
      description,
      budget,
      currency: currency || 'USD',
      deadline: deadline || 'Flexible',
      status: 'Pending',
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
