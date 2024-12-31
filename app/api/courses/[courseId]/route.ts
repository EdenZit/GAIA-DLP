// app/api/courses/[courseId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Course } from '@/app/models/Course';
import { connectDB } from '@/app/lib/db';
import { courseInputSchema } from '@/app/lib/validations/course';

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
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // If course is not published, only instructor can view it
    if (!course.published && 
        (!session?.user || course.instructor.toString() !== session.user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Course GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const course = await Course.findById(params.courseId);
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (course.instructor.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = courseInputSchema.parse(body);

    const updatedCourse = await Course.findByIdAndUpdate(
      params.courseId,
      { 
        ...validatedData, 
        updatedAt: new Date() 
      },
      { 
        new: true,
        runValidators: true
      }
    ).populate('instructor', 'name email');

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Course PUT error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const course = await Course.findById(params.courseId);
    
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (course.instructor.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await Course.findByIdAndDelete(params.courseId);
    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Course DELETE error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
