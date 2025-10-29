import { z } from 'zod';

export const createBrandSchema = z.object({
  body: z.object({
    brandName: z.string().min(1, 'Brand name is required').max(100),
    description: z.string().max(500).optional(),
    country: z.string().max(100).optional()
  })
});

export const updateBrandSchema = z.object({
  body: z.object({
    brandName: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    country: z.string().max(100).optional()
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid brand ID')
  })
});

export const deleteBrandSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid brand ID')
  })
});
