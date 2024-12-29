// app/lib/validations/resource.ts
import { z } from 'zod';

export const resourceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  type: z.enum(['document', 'video', 'image', 'link', 'other']),
  url: z.string().url('Invalid URL'),
  courseId: z.string(),
  accessLevel: z.enum(['public', 'enrolled', 'instructor']).default('enrolled'),
  metadata: z.object({
    duration: z.number().optional(),
    dimensions: z.object({
      width: z.number().optional(),
      height: z.number().optional()
    }).optional(),
    tags: z.array(z.string()).optional()
  }).optional()
});

export type ResourceFormData = z.infer<typeof resourceSchema>;
