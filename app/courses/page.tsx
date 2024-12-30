// app/courses/page.tsx
import { CourseGrid } from '@/app/components/course/list/CourseGrid'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Courses - GAIA-DLP',
  description: 'Browse all available courses'
}

export default function CoursesPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">Courses</h1>
      <CourseGrid showCreateButton />
    </div>
  )
}
