import { z } from 'zod';

export const PostFormSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).max(32),
  body: z.string().min(1).max(255),
});

export type PostFormSchemaType = z.infer<typeof PostFormSchema>;
