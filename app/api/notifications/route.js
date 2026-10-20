import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
    }

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(20);
    return NextResponse.json({ success: true, notifications });
  } catch (error) {
    console.error('Notification Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { userId, title, message, type } = await request.json();

    if (!userId || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const notification = await Notification.create({
      userId,
      title,
      message,
      type: type || 'activity',
    });

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error('Notification Create Error:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}
