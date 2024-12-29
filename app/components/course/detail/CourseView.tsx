// app/components/course/detail/CourseView.tsx
import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs'

interface CourseContent {
  title: string
  type: 'text' | 'video' | 'quiz'
  content: string
  order: number
}

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
  content: CourseContent[]
  price: number
  published: boolean
  createdAt: string
  updatedAt: string
}

interface CourseViewProps {
  course: Course
}

export function CourseView({ course }: CourseViewProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const isInstructor = session?.user?.email === course.instructor.email

  const sortedContent = [...course.content].sort((a, b) => a.order - b.order)

  const renderContent = (content: CourseContent) => {
    switch (content.type) {
      case 'text':
        return (
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
        )
      case 'video':
        return (
          <div className="aspect-video">
            <iframe
              src={content.content}
              className="h-full w-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )
      case 'quiz':
        try {
          const quizData = JSON.parse(content.content)
          return (
            <div className="space-y-4">
              {/* Quiz rendering logic here */}
              <pre className="overflow-x-auto rounded-lg bg-gray-50 p-4">
                {JSON.stringify(quizData, null, 2)}
              </pre>
            </div>
          )
        } catch (error) {
          return <div>Invalid quiz data</div>
        }
    }
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-8 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-sm text-gray-500">
            By {course.instructor.name} · Updated {new Date(course.updatedAt).toLocaleDateString()}
          </p>
        </div>
        {isInstructor && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/courses/${course._id}/edit`)}
            >
              Edit Course
            </Button>
            <Button
              variant={course.published ? "outline" : "default"}
              onClick={async () => {
                try {
                  const response = await fetch(`/api/courses/${course._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ published: !course.published })
                  })
                  if (!response.ok) throw new Error('Failed to update course')
                  router.refresh()
                } catch (error) {
                  console.error('Error updating course:', error)
                }
              }}
            >
              {course.published ? 'Unpublish' : 'Publish'}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="prose max-w-none">
                <h2>About this course</h2>
                <p>{course.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={course.thumbnail || '/placeholder-course.jpg'}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-4 space-y-4">
                {course.price > 0 ? (
                  <p className="text-2xl font-bold">${course.price}</p>
                ) : (
                  <p className="text-2xl font-bold text-green-600">Free</p>
                )}
                <Button className="w-full">Enroll Now</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="content">Course Content</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="discussions">Discussions</TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="mt-6">
              <div className="space-y-6">
                {sortedContent.map((content, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <h3 className="mb-4 text-xl font-semibold">
                        {content.title}
                        <Badge variant="secondary" className="ml-2">
                          {content.type}
                        </Badge>
                      </h3>
                      {renderContent(content)}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="announcements">
              <p className="text-gray-500">No announcements yet.</p>
            </TabsContent>
            <TabsContent value="discussions">
              <p className="text-gray-500">No discussions yet.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
