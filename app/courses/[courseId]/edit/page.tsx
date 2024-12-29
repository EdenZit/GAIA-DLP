// app/courses/[courseId]/edit/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { CourseBuilder } from '@/app/components/course/create/CourseBuilder'
import { connectDB } from '@/app/lib/db'
import { Course } from '@/app/models/Course'

interface Props {
  params: { courseId: string }
}

export default async function EditCoursePage({ params }: Props) {
  const session = await getServerSession()
  
  if (!session?.user) {
    redirect('/login?callbackUrl=/courses/${params.courseId}/edit')
  }

  await connectDB()
  const course = await Course.findById(params.courseId)
    .populate('instructor', 'name email')

  if (!course) {
    redirect('/courses')
  }

  // Check if user is the course instructor
  if (course.instructor.email !== session.user.email) {
    redirect('/courses')
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">Edit Course</h1>
      <CourseBuilder initialData={JSON.parse(JSON.stringify(course))} />
    </div>
  )
}
