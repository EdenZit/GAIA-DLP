// app/components/course/ResourceManager.tsx
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resourceSchema, type ResourceFormData } from '@/lib/validations/resource';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createResource, deleteResource } from '@/lib/actions/resources';

interface ResourceManagerProps {
  courseId: string;
  resources: Array<{
    id: string;
    title: string;
    type: string;
    url: string;
    description?: string;
    accessLevel: 'public' | 'enrolled' | 'instructor';
  }>;
  onResourceChange?: () => void;
}

export default function ResourceManager({ courseId, resources, onResourceChange }: ResourceManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      courseId,
      accessLevel: 'enrolled'
    }
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);
      formData.append('courseId', courseId);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      onResourceChange?.();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  }, [courseId, onResourceChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'video/*': ['.mp4', '.mov'],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const onSubmit = async (data: ResourceFormData) => {
    try {
      setIsUploading(true);
      setError(null);
      await createResource({ ...data, courseId });
      reset();
      onResourceChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create resource');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await deleteResource(id, courseId);
      onResourceChange?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete resource');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Resources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <p>Uploading...</p>
          ) : isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <p>Drag and drop files here, or click to select files</p>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Resource Title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Description (optional)"
              className="h-24"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                {...register('type')}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="document">Document</option>
                <option value="video">Video</option>
                <option value="image">Image</option>
                <option value="link">Link</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessLevel">Access Level</Label>
              <select
                id="accessLevel"
                {...register('accessLevel')}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="public">Public</option>
                <option value="enrolled">Enrolled Students</option>
                <option value="instructor">Instructors Only</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              {...register('url')}
              placeholder="Resource URL"
              type="url"
              className={errors.url ? 'border-red-500' : ''}
            />
            {errors.url && (
              <p className="text-red-500 text-sm">{errors.url.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isUploading}>
            {isUploading ? 'Adding...' : 'Add Resource'}
          </Button>
        </form>

        <div className="mt-6 space-y-4">
          {resources.map((resource) => (
            <Card key={resource.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-medium">{resource.title}</h3>
                  {resource.description && (
                    <p className="text-sm text-gray-500">{resource.description}</p>
                  )}
                  <p className="text-sm text-gray-500">{resource.type}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(resource.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
