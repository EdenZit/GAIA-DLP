// app/courses/[courseId]/page.tsx
import { notFound } from 'next/navigation'
import { CourseView } from '@/app/components/course/detail/CourseView'
import { connectDB } from '@/app/lib/db'
import { Course } from '@/app/models/Course'

export async function generateMetadata({ params }: { params: { courseId: string } }) {
  try {
    await connectDB()
    const course = await Course.findById(params.courseId)
      .populate('instructor', 'name email')

    if (!course) {
      return {
        title: 'Course Not Found - GAIA-DLP',
        description: 'The requested course could not be found.'
      }
    }

    return {
      title: `${course.title} - GAIA-DLP`,
      description: course.description
    }
  } catch (error) {
    return {
      title: 'Error - GAIA-DLP',
      description: 'There was an error loading the course.'
    }
  }
}

export default async function CoursePage({ params }: { params: { courseId: string } }) {
  try {
    await connectDB()
    const course = await Course.findById(params.courseId)
      .populate('instructor', 'name email')

    if (!course) {
      notFound()
    }

    return <CourseView course={JSON.parse(JSON.stringify(course))} />
  } catch (error) {
    throw new Error('Failed to fetch course')
  }
}
