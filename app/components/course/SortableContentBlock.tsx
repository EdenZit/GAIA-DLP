// app/components/course/create/SortableContentBlock.tsx
import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { Editor } from '@tinymce/tinymce-react'
import { Card, CardContent } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Textarea } from '@/app/components/ui/textarea'

interface ContentBlock {
  id: string
  title: string
  type: 'text' | 'video' | 'quiz'
  content: string
  order: number
}

interface Props {
  block: ContentBlock
  onUpdate: (updates: Partial<ContentBlock>) => void
  onRemove: () => void
}

export function SortableContentBlock({ block, onUpdate, onRemove }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  }

  const renderContent = () => {
    switch (block.type) {
      case 'text':
        return (
          <Editor
            value={block.content}
            onEditorChange={(content) => onUpdate({ content })}
            init={{
              height: 300,
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
                'fullscreen', 'insertdatetime', 'media', 'table', 'code',
                'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
              content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 16px; }',
            }}
          />
        )
      case 'video':
        return (
          <div className="space-y-2">
            <Label htmlFor={`video-${block.id}`}>Video URL</Label>
            <Input
              id={`video-${block.id}`}
              value={block.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="Enter video URL (YouTube, Vimeo, etc.)"
            />
            {block.content && (
              <div className="aspect-video mt-2">
                <iframe
                  src={block.content}
                  className="h-full w-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )
      case 'quiz':
        return (
          <div className="space-y-2">
            <Label>Quiz Content</Label>
            <Textarea
              value={block.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="Enter quiz questions in JSON format"
              rows={10}
              className="font-mono text-sm"
            />
            {block.content && (
              <div className="rounded-lg bg-gray-50 p-4">
                <pre className="overflow-x-auto text-sm">
                  {JSON.stringify(JSON.parse(block.content), null, 2)}
                </pre>
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <Card ref={setNodeRef} style={style} className="relative">
      <div
        className="absolute left-0 top-0 h-full w-8 cursor-move border-r bg-gray-50 p-2 hover:bg-gray-100"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>
      <CardContent className="ml-8 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex-1">
            <Label htmlFor={`title-${block.id}`}>Title</Label>
            <Input
              id={`title-${block.id}`}
              value={block.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="max-w-md"
              placeholder={`Enter ${block.type} block title`}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRemove}
            className="ml-4"
          >
            Remove
          </Button>
        </div>

        {renderContent()}
      </CardContent>
    </Card>
  )
}
