// app/api/courses/[courseId]/resources/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Resource from '@/app/models/Resource';  // Updated path
import { resourceSchema } from '@/app/lib/validations/resource';  // Updated path
import { connectDB } from '@/app/lib/db';  // Updated to use main db connection
import { rateLimit } from '@/app/lib/rate-limit';  // Updated path

// Rate limiting configuration
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500 // Max 500 users per second
});

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    // Apply rate limiting
    try {
      await limiter.check(request, 60, 'RESOURCE_GET');
    } catch {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    await connectDB();  // Updated function name
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resources = await Resource.find({ courseId: params.courseId })
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name email');

    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    // Apply rate limiting
    try {
      await limiter.check(request, 10, 'RESOURCE_POST');
    } catch {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    await connectDB();  // Updated function name
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const json = await request.json();
    const validatedData = resourceSchema.parse({
      ...json,
      courseId: params.courseId
    });

    const resource = new Resource({
      ...validatedData,
      uploadedBy: session.user.id
    });

    await resource.save();
    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation Error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
