import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Profile from '@/models/Profile';
import User from '@/models/User';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
    }

    let profile = await Profile.findOne({ userId });
    
    // If profile doesn't exist, try to create one from user data
    if (!profile) {
      const user = await User.findById(userId);
      if (user) {
        profile = await Profile.create({
          userId,
          fullName: user.name,
          email: user.email,
        });
      }
    }

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Profile Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const { userId } = data;

    if (!userId) {
      return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
    }

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { ...data, updatedAt: Date.now() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Profile Update Error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

export async function PUT(request) {
  // Keeping PUT for backward compatibility if needed, but switching logic to Profile model
  return POST(request);
}
