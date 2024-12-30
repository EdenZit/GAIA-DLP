// app/components/course/list/CourseGrid.tsx

'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { CourseCard } from '../CourseCard'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import { useDebounce } from '@/app/lib/hooks/useDebounce'
import { PlusCircle } from 'lucide-react'

interface Course {
  _id: string
  title: string
  description: string
  thumbnail: string
  instructor: {
    _id: string
    name: string
    email: string
  }
  price: number
  published: boolean
}

interface CourseGridProps {
  instructorId?: string
  showCreateButton?: boolean
}

export function CourseGrid({ instructorId, showCreateButton }: CourseGridProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  const debouncedSearch = useDebounce(search, 500)

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        search: debouncedSearch,
        ...(instructorId && { instructor: instructorId })
      })
      
      const response = await fetch(`/api/courses?${params}`)
      if (!response.ok) throw new Error('Failed to fetch courses')
      
      const data = await response.json()
      setCourses(data.courses)
      setTotalPages(data.pages)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [page, debouncedSearch, instructorId])

  const handleCreateCourse = () => {
    router.push('/courses/create')
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-96 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4">
          <Input
            type="search"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
        {showCreateButton && session && (
          <Button onClick={handleCreateCourse}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        )}
      </div>

      {courses.length === 0 ? (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed">
          <p className="mb-4 text-lg text-gray-500">No courses found</p>
          {showCreateButton && session && (
            <Button onClick={handleCreateCourse} variant="outline">
              Create your first course
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                isInstructor={session?.user?.email === course.instructor.email}
                onEdit={() => router.push(`/courses/${course._id}/edit`)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
