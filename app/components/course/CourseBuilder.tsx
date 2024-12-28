// app/components/course/create/CourseBuilder.tsx
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Editor } from '@tinymce/tinymce-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'
import { Card, CardContent } from '@/app/components/ui/card'
import { toast } from '@/app/components/ui/use-toast'
import { SortableContentBlock } from './SortableContentBlock'

interface ContentBlock {
  id: string
  title: string
  type: 'text' | 'video' | 'quiz'
  content: string
  order: number
}

export function CourseBuilder() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [thumbnail, setThumbnail] = useState('')
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])
  const [loading, setLoading] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over) return

    if (active.id !== over.id) {
      setContentBlocks((blocks) => {
        const oldIndex = blocks.findIndex((block) => block.id === active.id)
        const newIndex = blocks.findIndex((block) => block.id === over.id)

        return arrayMove(blocks, oldIndex, newIndex).map((block, index) => ({
          ...block,
          order: index,
        }))
      })
    }
  }

  const addContentBlock = (type: 'text' | 'video' | 'quiz') => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      title: '',
      type,
      content: '',
      order: contentBlocks.length,
    }
    setContentBlocks([...contentBlocks, newBlock])
  }

  const updateContentBlock = (id: string, updates: Partial<ContentBlock>) => {
    setContentBlocks(blocks =>
      blocks.map(block =>
        block.id === id ? { ...block, ...updates } : block
      )
    )
  }

  const removeContentBlock = (id: string) => {
    setContentBlocks(blocks =>
      blocks.filter(block => block.id !== id)
        .map((block, index) => ({ ...block, order: index }))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          price,
          thumbnail,
          content: contentBlocks.map(({ id, ...block }) => block),
          published: false,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create course')
      }

      const course = await response.json()
      toast({
        title: "Success",
        description: "Course created successfully",
      })
      router.push(`/courses/${course._id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create course',
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Course Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter course title"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter course description"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            placeholder="0.00"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="thumbnail">Thumbnail URL</Label>
          <Input
            id="thumbnail"
            type="url"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="mt-1"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => addContentBlock('text')}
            >
              Add Text Block
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => addContentBlock('video')}
            >
              Add Video
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => addContentBlock('quiz')}
            >
              Add Quiz
            </Button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={contentBlocks.map(block => block.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {contentBlocks.map((block) => (
                  <SortableContentBlock
                    key={block.id}
                    block={block}
                    onUpdate={(updates) => updateContentBlock(block.id, updates)}
                    onRemove={() => removeContentBlock(block.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Course'}
        </Button>
      </div>
    </form>
  )
}
