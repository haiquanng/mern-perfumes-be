import { z } from 'zod';

export const getSimilarSchema = z.object({
  params: z.object({
    perfumeId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid perfume ID')
  })
});

export const getSummarySchema = z.object({
  params: z.object({
    perfumeId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid perfume ID')
  })
});

export const chatSchema = z.object({
  body: z.object({
    query: z.string().min(1, 'Query is required').max(500, 'Query too long')
  })
});
