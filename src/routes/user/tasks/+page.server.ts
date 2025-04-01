import { simpleTaskSchema, taskDeleteSchema } from '$lib/schemas/task-schema';
import prisma from '$lib/server/prisma';
import { atStartOfDay } from '$lib/utils';
import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export async function load() {
	return {
		tasks: await prisma.task.findMany(),
		form: await superValidate(zod(simpleTaskSchema))
	};
}

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event, zod(simpleTaskSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		await prisma.task.create({
			data: {
				name: form.data.name,
				date: atStartOfDay(new Date())
			}
		});

		return {
			form
		};
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const data = taskDeleteSchema.parse(formData);

		await prisma.task.delete({
			where: {
				id: data.id
			}
		});

		return {
			success: true
		};
	}
};
