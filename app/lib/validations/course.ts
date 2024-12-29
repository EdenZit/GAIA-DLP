// app/lib/validations/course.ts
import { z } from 'zod'

export const courseContentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  type: z.enum(['text', 'video', 'quiz'], {
    required_error: 'Content type must be text, video, or quiz'
  }),
  content: z.string().min(1, 'Content is required'),
  order: z.number().int().min(0)
})

export const courseInputSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(5000, 'Description must be less than 5000 characters'),
  content: z.array(courseContentSchema)
    .default([])
    .transform(items => 
      items.map((item, index) => ({ ...item, order: index }))
    ),
  thumbnail: z.string().url().optional(),
  price: z.number()
    .min(0, 'Price cannot be negative')
    .default(0),
  published: z.boolean().default(false)
})

export type CourseInput = z.infer<typeof courseInputSchema>
export type CourseContent = z.infer<typeof courseContentSchema>
