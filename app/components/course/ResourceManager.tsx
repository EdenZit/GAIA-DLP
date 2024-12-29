// app/components/course/ResourceManager.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resourceSchema, type ResourceFormData } from '@/lib/validations/resource';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { createResource } from '@/lib/actions/resources';

interface ResourceManagerProps {
  courseId: string;
}

export default function ResourceManager({ courseId }: ResourceManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      courseId,
      accessLevel: 'enrolled'
    }
  });

  const onSubmit = async (data: ResourceFormData) => {
    try {
      setIsUploading(true);
      await createResource(data);
      // Handle success (e.g., show notification, reset form)
    } catch (error) {
      // Handle error
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            {...register('title')}
            placeholder="Resource Title"
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <Textarea
          {...register('description')}
          placeholder="Description (optional)"
          className="h-24"
        />

        <div className="grid grid-cols-2 gap-4">
          <select {...register('type')} className="form-select">
            <option value="document">Document</option>
            <option value="video">Video</option>
            <option value="image">Image</option>
            <option value="link">Link</option>
            <option value="other">Other</option>
          </select>

          <select {...register('accessLevel')} className="form-select">
            <option value="public">Public</option>
            <option value="enrolled">Enrolled Students</option>
            <option value="instructor">Instructors Only</option>
          </select>
        </div>

        <Input
          {...register('url')}
          placeholder="Resource URL"
          type="url"
          className={errors.url ? 'border-red-500' : ''}
        />

        <Button type="submit" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Add Resource'}
        </Button>
      </form>
    </Card>
  );
}
