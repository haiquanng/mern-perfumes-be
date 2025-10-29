import { z } from 'zod';

export const addCommentSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
    content: z.string().min(10, 'Comment must be at least 10 characters').max(1000, 'Comment too long')
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid perfume ID')
  })
});

export const getCommentsSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid perfume ID')
  })
});
