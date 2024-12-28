// app/components/course/list/CourseGrid.tsx
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { CourseCard } from '../CourseCard'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import { useDebounce } from '@/app/lib/hooks/useDebounce'
import { Loader2 } from 'lucide-react'

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
      <div className="flex
