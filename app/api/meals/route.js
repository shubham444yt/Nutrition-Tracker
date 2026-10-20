import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Meal from '@/models/Meal';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
    }

    const meals = await Meal.find({ userId }).sort({ date: -1 });
    return NextResponse.json(meals);
  } catch (error) {
    console.error('Meals GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch meals' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    console.log('Incoming Meal Data:', body);
    
    // Ensure userId is present and valid
    if (!body.userId) {
       console.error('Missing userId in request body');
       return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Optional: Validate if userId is a valid ObjectId string
    // if (!mongoose.Types.ObjectId.isValid(body.userId)) { ... }

    const meal = await Meal.create(body);
    return NextResponse.json({ success: true, meal });
  } catch (error) {
    console.error('Meals POST Error:', error);
    // Return specific validation error if possible
    let errorMessage = 'Failed to log meal';
    if (error.name === 'ValidationError') {
      errorMessage = Object.values(error.errors).map(val => val.message).join(', ');
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}



export async function DELETE(request) {
   try {
     await dbConnect();
     const { searchParams } = new URL(request.url);
     const id = searchParams.get('id');
     await Meal.findByIdAndDelete(id);
     return NextResponse.json({ success: true });
   } catch (error) {
     return NextResponse.json({ error: 'Failed to delete meal' }, { status: 500 });
   }
}
