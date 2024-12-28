// app/lib/validations/course.ts
import { z } from 'zod'

export const courseInputSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  content: z.array(z.object({
    title: z.string(),
    type: z.string(),
    content: z.string(),
    order: z.number()
  })),
  thumbnail: z.string().optional(),
  price: z.number().min(0),
  published: z.boolean().optional()
})
