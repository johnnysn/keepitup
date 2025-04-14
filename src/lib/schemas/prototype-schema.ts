import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const prototypeFormSchema = z.object({
	name: z.string().min(2).max(100),
	description: z.optional(z.string().max(100)),
	weekDays: z.string().regex(/[01]{7}/)
});

export const prototypeSimpleUpdateSchema = zfd.formData({
	id: zfd.text(z.string().min(2)),
	name: zfd.text(z.string().min(2).max(100)),
	description: zfd.text(z.optional(z.string().max(100))),
	weekDays: zfd.text(z.string().regex(/[01]{7}/))
});

export type PrototypeFormSchema = typeof prototypeFormSchema;

export const prototypeDeleteSchema = zfd.formData({
	id: zfd.text(z.string().min(2))
});

export const prototypeOrderUpdateSchema = zfd.formData({
	ids: zfd.text(
		z.string().transform((input) => {
			return input.split(',').map((id) => id.trim());
		})
	)
});
