import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import User from '@/app/models/User';

export async function GET(request: Request) {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Database connected successfully');
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (email) {
      console.log('Searching for user with email:', email);
      
      const user = await User.findOne(
        { email },
        { 
          _id: 1,
          email: 1,
          name: 1,
          role: 1,
          createdAt: 1,
          updatedAt: 1
        }
      ).lean();
      
      console.log('User search result:', user ? 'Found' : 'Not found');
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        status: 'success',
        user
      });
    }
    
    console.log('Fetching all users...');
    const users = await User.find({}, {
      password: 0,
      __v: 0
    }).lean();
    
    console.log(`Found ${users.length} users`);
    
    return NextResponse.json({
      status: 'success',
      users
    });
    
  } catch (error) {
    console.error('Error in users route:', error);
    
    // Detailed error response
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, {
      status: 500
    });
  }
}
