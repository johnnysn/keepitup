import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const simpleTaskSchema = z.object({
	name: z.string().min(2).max(100)
});

export type SimpleTaskSchema = typeof simpleTaskSchema;

export const taskDeleteSchema = zfd.formData({
	id: zfd.text(z.string().min(2))
});
