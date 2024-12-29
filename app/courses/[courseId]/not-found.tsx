// app/courses/[courseId]/not-found.tsx
import Link from 'next/link'
import { Button } from '@/app/components/ui/button'

export default function CourseNotFound() {
  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Course Not Found</h1>
      <p className="mb-8 mt-4 text-lg text-gray-600">
        The course you're looking for doesn't exist or has been removed.
      </p>
      <Link href="/courses">
        <Button>Browse Courses</Button>
      </Link>
    </div>
  )
}
