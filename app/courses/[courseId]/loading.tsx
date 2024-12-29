// app/courses/[courseId]/loading.tsx
import { Skeleton } from '@/app/components/ui/skeleton'

export default function CourseLoading() {
  return (
    <div className="container mx-auto max-w-6xl space-y-8 p-4">
      <div className="space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Skeleton className="h-[400px] rounded-lg" />
        </div>
        <div>
          <Skeleton className="h-[300px] rounded-lg" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
