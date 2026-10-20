import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const contact = await Contact.create(body);
    return NextResponse.json({ success: true, contact });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
