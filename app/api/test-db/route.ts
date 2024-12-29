// app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/db';

export async function GET() {
  try {
    console.log('Attempting database connection...');
    const mongoose = await connectDB();
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      connectionState: mongoose.connection.readyState,
      database: mongoose.connection.name
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    }, { status: 500 });
  }
}
