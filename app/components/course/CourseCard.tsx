'use client'

import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'

interface CourseCardProps {
  course: {
    _id: string
    title: string
    description: string
    thumbnail: string
    instructor: {
      name: string
      email: string
    }
    price: number
    published: boolean
  }
  onEdit?: () => void
  isInstructor?: boolean
}

export function CourseCard({ course, onEdit, isInstructor }: CourseCardProps) {
  return (
    <Card className="w-full max-w-sm transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={course.thumbnail || '/assets/placeholder-course.jpg'}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">{course.title}</h3>
            {!course.published && (
              <Badge variant="secondary" className="mt-1">
                Draft
              </Badge>
            )}
          </div>
          {course.price > 0 ? (
            <span className="text-lg font-bold">${course.price}</span>
          ) : (
            <span className="text-lg font-medium text-green-600">Free</span>
          )}
        </div>
        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
          {course.description}
        </p>
        <div className="text-sm text-gray-500">
          By {course.instructor.name}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        <a href={`/courses/${course._id}`}>
          <Button variant="default">View Course</Button>
        </a>
        {isInstructor && (
          <Button variant="outline" onClick={onEdit}>
            Edit Course
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
