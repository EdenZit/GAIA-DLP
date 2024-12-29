// app/courses/create/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { CourseBuilder } from '@/app/components/course/create/CourseBuilder'

export const metadata = {
  title: 'Create Course - GAIA-DLP',
  description: 'Create a new course'
}

export default async function CreateCoursePage() {
  const session = await getServerSession()
  
  if (!session?.user) {
    redirect('/login?callbackUrl=/courses/create')
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">Create New Course</h1>
      <CourseBuilder />
    </div>
  )
}
