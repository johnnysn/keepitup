import { z } from 'zod';

export const prototypeFormSchema = z.object({
	name: z.string().min(2).max(100),
	description: z.optional(z.string().max(100)),
	sunday: z.boolean().default(false),
	monday: z.boolean().default(false),
	tuesday: z.boolean().default(false),
	wednesday: z.boolean().default(false),
	thursday: z.boolean().default(false),
	friday: z.boolean().default(false),
	saturday: z.boolean().default(false)
});

export type PrototypeFormSchema = typeof prototypeFormSchema;
