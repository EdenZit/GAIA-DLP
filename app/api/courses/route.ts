// app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Course } from '@/app/models/Course';
import { courseInputSchema } from '@/app/lib/validations/course';
import { connectDB } from '@/app/lib/db';
import { rateLimit } from '@/app/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Apply rate limiting
    const limiter = await rateLimit();
    const response = await limiter.check();
    if (!response.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    await connectDB();
    const body = await req.json();
    
    // Validate input data
    const validatedData = courseInputSchema.parse(body);

    const course = new Course({
      ...validatedData,
      instructor: session.user.id
    });

    await course.save();
    await course.populate('instructor', 'name email');
    
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('Course POST error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const instructorId = searchParams.get('instructor');
    const published = searchParams.get('published');

    const query: any = {};
    
    // Build query
    if (search) {
      query.$text = { $search: search };
    }
    if (instructorId) {
      query.instructor = instructorId;
    }
    if (published !== null) {
      query.published = published === 'true';
    }

    const [courses, total] = await Promise.all([
      Course.find(query)
        .populate('instructor', 'name email')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Course.countDocuments(query)
    ]);

    return NextResponse.json({
      courses,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    });
  } catch (error) {
    console.error('Course GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// Add this file: app/api/courses/[courseId]/route.ts
export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession();
    await connectDB();

    const course = await Course.findById(params.courseId)
      .populate('instructor', 'name email');

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // If course is not published, only instructor can view it
    if (!course.published && 
        (!session?.user || course.instructor.toString() !== session.user.id)) {
      return NextResponse.json(
        { error: 'Not authorized to view this course' },
        { status: 403 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Course GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}
