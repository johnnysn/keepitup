import { z } from 'zod';
import { zfd } from 'zod-form-data';

const typeEnum = z.enum(['DAILY', 'FLOATING']);

const nameSchema = z
	.string()
	.min(2, { message: 'Minimum 2 characters' })
	.max(100, { message: 'Maximum 100 characters' });

const descriptionSchema = z.optional(z.string().max(100, { message: 'Maximum 100 characters' }));

export const simpleTaskSchema = z.object({
	name: nameSchema,
	date: z.optional(z.coerce.date()),
	type: typeEnum.default('DAILY')
});

export type SimpleTaskSchema = typeof simpleTaskSchema;

export const formTaskSchema = z.object({
	name: nameSchema,
	description: descriptionSchema,
	date: z.string().refine((v) => v, { message: 'The date is required' })
});

export type FormTaskSchema = typeof formTaskSchema;

export const taskDeleteSchema = zfd.formData({
	id: zfd.text(z.string().min(2))
});

export const taskUpdateSchema = zfd.formData({
	id: zfd.text(z.string().min(2)),
	description: zfd.text(z.string().optional()),
	name: zfd.text(nameSchema),
	done: zfd.text(z.string().transform((value) => value === 'true'))
});

const commaSeparatedIdsSchema = z.string().transform((input) => {
	return input.split(',').map((id) => id.trim());
});

export const taskOrderUpdateSchema = zfd.formData({
	ids: zfd.text(commaSeparatedIdsSchema),
	type: zfd.text(typeEnum)
});
