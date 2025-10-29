import { z } from 'zod';

export const getSimilarSchema = z.object({
  params: z.object({
    perfumeId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid perfume ID')
  }),
  query: z.object({
    forceRefresh: z.enum(['true', 'false', '1', '0']).optional().transform(val => val === 'true' || val === '1')
  }).optional()
});

export const getSummarySchema = z.object({
  params: z.object({
    perfumeId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid perfume ID')
  }),
  query: z.object({
    forceRefresh: z.enum(['true', 'false', '1', '0']).optional().transform(val => val === 'true' || val === '1')
  }).optional()
});

export const chatSchema = z.object({
  body: z.object({
    query: z.string().min(1, 'Query is required').max(1000, 'Query too long'),
    includeContext: z.boolean().optional().default(false),
    stream: z.boolean().optional().default(false)
  })
});
