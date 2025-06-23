import { coerce, z } from 'zod';
import { zfd } from 'zod-form-data';

const remainingCountField = zfd.numeric(z.number().min(1).optional());

export const prototypeFormSchema = z.object({
	name: z.string().min(2).max(100),
	description: z.optional(z.string().max(100)),
	weekDays: z.string().regex(/[01]{7}/),
	remainingCount: z.optional(z.number({ coerce: true }).min(1))
});

export const prototypeSimpleUpdateSchema = zfd.formData({
	id: zfd.text(z.string().min(2)),
	name: zfd.text(z.string().min(2).max(100)),
	description: zfd.text(z.optional(z.string().max(100))),
	weekDays: zfd.text(z.string().regex(/[01]{7}/)),
	remainingCount: remainingCountField
});

export type PrototypeFormSchema = typeof prototypeFormSchema;

export const prototypeDeleteSchema = zfd.formData({
	id: zfd.text(z.string().min(2))
});

export const prototypeActivationSchema = zfd.formData({
	id: zfd.text(z.string().min(2)),
	active: zfd.text(z.string().transform((value) => value === 'true'))
});

export const prototypeOrderUpdateSchema = zfd.formData({
	ids: zfd.text(
		z.string().transform((input) => {
			return input.split(',').map((id) => id.trim());
		})
	)
});
