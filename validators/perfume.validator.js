import { z } from 'zod';

export const createPerfumeSchema = z.object({
  body: z.object({
    perfumeName: z.string().min(1, 'Perfume name is required').max(200),
    uri: z.string().url('Invalid image URL'),
    price: z.number().positive('Price must be positive'),
    concentration: z.string().min(1, 'Concentration is required'),
    description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
    ingredients: z.string().max(1000).optional(),
    volume: z.number().positive('Volume must be positive'),
    stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
    targetAudience: z.enum(['male', 'female', 'unisex'], {
      errorMap: () => ({ message: 'Target audience must be male, female, or unisex' })
    }),
    brand: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid brand ID')
  })
});

export const updatePerfumeSchema = z.object({
  body: z.object({
    perfumeName: z.string().min(1).max(200).optional(),
    uri: z.string().url('Invalid image URL').optional(),
    price: z.number().positive('Price must be positive').optional(),
    concentration: z.string().min(1).optional(),
    description: z.string().min(10).max(2000).optional(),
    ingredients: z.string().max(1000).optional(),
    volume: z.number().positive('Volume must be positive').optional(),
    stock: z.number().int().min(0, 'Stock cannot be negative').optional(),
    targetAudience: z.enum(['male', 'female', 'unisex']).optional(),
    brand: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid brand ID').optional()
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid perfume ID')
  })
});

export const getPerfumeSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid perfume ID')
  })
});

export const listPerfumesSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    brand: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid brand ID').optional(),
    concentration: z.string().optional(),
    targetAudience: z.enum(['male', 'female', 'unisex']).optional()
  })
});

export const deletePerfumeSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid perfume ID')
  })
});
