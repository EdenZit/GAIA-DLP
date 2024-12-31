//app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import mongoose from 'mongoose';
import Course from '@/app/models/Course';
import { connectDB } from '@/app/lib/mongodb';
import { mongodb as dbConnect } from '@/app/lib/mongodb';
import { authOptions } from '@/app/utils/auth-config';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const searchParams = req.nextUrl.searchParams;
    const query: any = {};
    
    // Build query based on search parameters
    if (searchParams.has('category')) {
      query.category = searchParams.get('category');
    }
    if (searchParams.has('level')) {
      query.level = searchParams.get('level');
    }
    if (searchParams.has('status')) {
      query.status = searchParams.get('status');
    }
    if (searchParams.has('instructor')) {
      query.instructor = new mongoose.Types.ObjectId(searchParams.get('instructor')!);
    }
    if (searchParams.has('search')) {
      query.$text = { $search: searchParams.get('search')! };
    }

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const courses = await Course.find(query)
      .skip(skip)
      .limit(limit)
      .populate('instructor', 'name email')
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(query);

    return NextResponse.json({
      courses,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await req.json();

    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'level', 'duration'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create new course
    const course = new Course({
      ...body,
      instructor: session.user.id,
      status: 'draft'
    });

    await course.save();

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { courseId, ...updateData } = await req.json();

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if user is the instructor
    if (course.instructor.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update course
    Object.assign(course, updateData);
    await course.save();

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    const { courseId } = await req.json();

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if user is the instructor
    if (course.instructor.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await course.deleteOne();

    return NextResponse.json(
      { message: 'Course deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
