import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import Message from '@/models/Message';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    await dbConnect();

    const customers = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, customers });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    let customerId = searchParams.get('id') || searchParams.get('customerId');

    if (!customerId) {
      try {
        const body = await request.json();
        customerId = body.customerId || body.id;
      } catch {
        // Query param may not be present and body may be empty
      }
    }

    if (!customerId) {
      return NextResponse.json({ success: false, error: 'Customer ID is required' }, { status: 400 });
    }

    await dbConnect();

    const targetUser = await User.findById(customerId);
    if (!targetUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // NEVER allow deleting an admin account
    if (targetUser.role === 'admin') {
      return NextResponse.json({ success: false, error: 'Cannot delete an administrator account' }, { status: 403 });
    }

    // Cannot delete self
    if (targetUser._id.toString() === session.userId.toString()) {
      return NextResponse.json({ success: false, error: 'Cannot delete your own account' }, { status: 403 });
    }

    // Delete customer's orders and messages to prevent orphaned data
    await Order.deleteMany({ customer: customerId });
    await Message.deleteMany({ user: customerId });

    // Delete user
    await User.findByIdAndDelete(customerId);

    return NextResponse.json({
      success: true,
      message: 'Customer account and associated data deleted successfully',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
