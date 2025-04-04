import { z } from 'zod';
import { zfd } from 'zod-form-data';

const nameSchema = z.string().min(2).max(100);

export const simpleTaskSchema = z.object({
	name: nameSchema,
	date: z.optional(z.coerce.date())
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

const commaSeparatedIdsSchema = z.string().transform((input) => {
	// Split the string by commas, remove any leading/trailing spaces from each ID
	return input.split(',').map((id) => id.trim());
});

export const taskOrderUpdateSchema = zfd.formData({
	ids: zfd.text(commaSeparatedIdsSchema)
});
