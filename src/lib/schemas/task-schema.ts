import { z } from 'zod';
import { zfd } from 'zod-form-data';

const nameSchema = z.string().min(2).max(100);

export const simpleTaskSchema = z.object({
	name: nameSchema
});

export type SimpleTaskSchema = typeof simpleTaskSchema;

export const taskDeleteSchema = zfd.formData({
	id: zfd.text(z.string().min(2))
});

export const taskUpdateSchema = zfd.formData({
	id: zfd.text(z.string().min(2)),
	description: zfd.text(z.string().optional()),
	name: zfd.text(nameSchema),
	done: zfd.text(z.string().transform((value) => value === 'true'))
});
