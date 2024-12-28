// app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Course } from '@/app/models/Course'
import { courseInputSchema } from '@/app/lib/validations/course'
import { connectDB } from '@/app/lib/db'
import { rateLimit } from '@/app/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Apply rate limiting
    const limiter = await rateLimit()
    const response = await limiter.check()
    if (!response.success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    await connectDB()

    const body = await req.json()
    const validatedData = courseInputSchema.parse(body)

    const course = new Course({
      ...validatedData,
      instructor: session.user.id
    })

    await course.save()
    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const instructorId = searchParams.get('instructor')

    const query = {
      ...(search && { title: { $regex: search, $options: 'i' } }),
      ...(instructorId && { instructor: instructorId })
    }

    const [courses, total] = await Promise.all([
      Course.find(query)
        .populate('instructor', 'name email')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Course.countDocuments(query)
    ])

    return NextResponse.json({
      courses,
      total,
      pages: Math.ceil(total / limit)
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
