// app/components/course/create/SortableContentBlock.tsx
'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ContentBlock {
  type: string;
  data: any;
  title: string;
  content: string;
}

interface Props {
  content: ContentBlock[];
  onChange: (content: ContentBlock[]) => void;
  error?: string;
}

export function SortableContentBlock({ content, onChange, error }: Props) {
  const updateBlock = (index: number, updates: Partial<ContentBlock>) => {
    const newContent = [...content];
    newContent[index] = { ...newContent[index], ...updates };
    onChange(newContent);
  };

  const removeBlock = (index: number) => {
    const newContent = content.filter((_, i) => i !== index);
    onChange(newContent);
  };

  const renderBlockContent = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'text':
        return (
          <Editor
            value={block.content}
            onEditorChange={(content) => updateBlock(index, { content })}
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
        );
      case 'video':
        return (
          <div className="space-y-2">
            <Label htmlFor={`video-${index}`}>Video URL</Label>
            <Input
              id={`video-${index}`}
              value={block.content}
              onChange={(e) => updateBlock(index, { content: e.target.value })}
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
        );
      case 'quiz':
        return (
          <div className="space-y-2">
            <Label>Quiz Content</Label>
            <Textarea
              value={block.content}
              onChange={(e) => updateBlock(index, { content: e.target.value })}
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {content.map((block, index) => {
        const {
          attributes,
          listeners,
          setNodeRef,
          transform,
          transition,
          isDragging,
        } = useSortable({ id: index.toString() });

        const style = {
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.5 : undefined,
        };

        return (
          <Card key={index} ref={setNodeRef} style={style} className="relative">
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
                  <Label htmlFor={`title-${index}`}>Title</Label>
                  <Input
                    id={`title-${index}`}
                    value={block.title || ''}
                    onChange={(e) => updateBlock(index, { title: e.target.value })}
                    className="max-w-md"
                    placeholder={`Enter ${block.type} block title`}
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeBlock(index)}
                  className="ml-4"
                >
                  Remove
                </Button>
              </div>
              {renderBlockContent(block, index)}
            </CardContent>
          </Card>
        );
      })}
      {error && (
        <div className="text-sm text-red-500" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

export default SortableContentBlock;
