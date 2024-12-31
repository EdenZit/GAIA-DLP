// app/components/course/create/CourseBuilder.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { useDebounce } from '@/app/lib/hooks/useDebounce';
import SortableContentBlock from './SortableContentBlock';
import ResourceManager from '../ResourceManager';

interface ValidationErrors {
  title?: string;
  description?: string;
  content?: string;
  tags?: string;
  general?: string;
}

interface CourseFormData {
  title: string;
  description: string;
  content: Array<{
    type: string;
    data: any;
  }>;
  resources: string[];
  tags: string[];
  status: 'draft' | 'published' | 'archived';
}

interface CourseBuilderProps {
  initialData?: Partial<CourseFormData>;
  isEditing?: boolean;
}

export default function CourseBuilder({ initialData, isEditing = false }: CourseBuilderProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [formData, setFormData] = useState<CourseFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || [],
    resources: initialData?.resources || [],
    tags: initialData?.tags || [],
    status: initialData?.status || 'draft'
  });

  // Validation rules
  const validateField = (name: string, value: any): string | undefined => {
    switch (name) {
      case 'title':
        if (!value.trim()) return 'Title is required';
        if (value.length < 3) return 'Title must be at least 3 characters';
        if (value.length > 100) return 'Title must be less than 100 characters';
        return undefined;
      
      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.length < 10) return 'Description must be at least 10 characters';
        if (value.length > 500) return 'Description must be less than 500 characters';
        return undefined;
      
      case 'content':
        if (!value.length) return 'At least one content block is required';
        return undefined;
      
      case 'tags':
        if (value.some((tag: string) => tag.length > 20)) {
          return 'Each tag must be less than 20 characters';
        }
        if (value.length > 10) return 'Maximum 10 tags allowed';
        return undefined;
      
      default:
        return undefined;
    }
  };

  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Validate each field
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof CourseFormData]);
      if (error) newErrors[key as keyof ValidationErrors] = error;
    });

    // Additional cross-field validations
    if (formData.content.length > 0 && !formData.content.some(block => block.type === 'text')) {
      newErrors.content = 'At least one text block is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Debounced tag processing
  const processTagsDebounced = useDebounce((value: string) => {
    const tags = value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    setFormData(prev => ({
      ...prev,
      tags
    }));

    const tagError = validateField('tags', tags);
    if (tagError) {
      setErrors(prev => ({ ...prev, tags: tagError }));
    } else {
      setErrors(prev => {
        const { tags, ...rest } = prev;
        return rest;
      });
    }
  }, 300);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'tags') {
      processTagsDebounced(value);
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => {
        const { [name as keyof ValidationErrors]: _, ...rest } = prev;
        return rest;
      });
    }

    // Immediate validation for title and description
    if (name === 'title' || name === 'description') {
      const error = validateField(name, value);
      if (error) {
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const url = isEditing 
        ? `/api/courses/${initialData?._id}`
        : '/api/courses';
      
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save course');
      }

      router.push(`/courses/${data._id}`);
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        general: err instanceof Error ? err.message : 'An unexpected error occurred'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (newContent: typeof formData.content) => {
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));

    const contentError = validateField('content', newContent);
    if (contentError) {
      setErrors(prev => ({ ...prev, content: contentError }));
    } else {
      setErrors(prev => {
        const { content, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="space-y-6 max-w-4xl mx-auto py-8"
      aria-label="Course creation form"
    >
      {errors.general && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errors.general}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Course' : 'Create New Course'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label 
              htmlFor="title" 
              className="text-sm font-medium"
            >
              Course Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              aria-describedby="title-error"
              aria-invalid={!!errors.title}
              required
              maxLength={100}
              placeholder="Enter course title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p 
                id="title-error" 
                className="text-sm text-red-500"
                role="alert"
              >
                {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="description" 
              className="text-sm font-medium"
            >
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              aria-describedby="description-error"
              aria-invalid={!!errors.description}
              required
              maxLength={500}
              placeholder="Enter course description"
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p 
                id="description-error" 
                className="text-sm text-red-500"
                role="alert"
              >
                {errors.description}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">Course Content</label>
            <SortableContentBlock
              content={formData.content}
              onChange={handleContentChange}
              error={errors.content}
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium">Resources</label>
            <ResourceManager
              resources={formData.resources}
              onChange={(resources) => setFormData(prev => ({ ...prev, resources }))}
            />
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="tags" 
              className="text-sm font-medium"
            >
              Tags (comma-separated)
            </label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags.join(', ')}
              onChange={handleChange}
              aria-describedby="tags-error tags-help"
              aria-invalid={!!errors.tags}
              placeholder="Enter tags (e.g., programming, web development)"
              className={errors.tags ? 'border-red-500' : ''}
            />
            <p 
              id="tags-help" 
              className="text-sm text-gray-500"
            >
              Add up to 10 tags, separated by commas
            </p>
            {errors.tags && (
              <p 
                id="tags-error" 
                className="text-sm text-red-500"
                role="alert"
              >
                {errors.tags}
              </p>
            )}
          </div>

          {isEditing && (
            <div className="space-y-2">
              <label 
                htmlFor="status" 
                className="text-sm font-medium"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  status: e.target.value as CourseFormData['status']
                }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                aria-label="Course status"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
              aria-label="Cancel course creation"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              aria-label={isEditing ? 'Update course' : 'Create course'}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg 
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                isEditing ? 'Update Course' : 'Create Course'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
