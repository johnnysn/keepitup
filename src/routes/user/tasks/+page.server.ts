import { simpleTaskSchema, taskDeleteSchema, taskUpdateSchema } from '$lib/schemas/task-schema';
import prisma from '$lib/server/prisma';
import { atStartOfDay } from '$lib/utils';
import { fail, error, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export async function load() {
	return {
		tasks: await prisma.task.findMany({
			orderBy: [
				{
					date: 'asc'
				},
				{
					order: 'asc'
				}
			]
		}),
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

		const session = await event.locals.auth();
		if (!session || !session.user || !session.user.email) error(401, 'User is not authorized.');

		await prisma.task.create({
			data: {
				name: form.data.name,
				date: atStartOfDay(new Date()),
				userEmail: session.user.email
			}
		});

		return {
			form
		};
	},
	delete: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session || !session.user || !session.user.email) error(401, 'User is not authorized.');

		const formData = await request.formData();
		const data = taskDeleteSchema.parse(formData);

		const savedTask = await prisma.task.findUnique({
			where: {
				id: data.id
			}
		});

		if (!savedTask || savedTask.userEmail !== session.user.email)
			return fail(403, { message: 'User does not have access to the task.' });

		await prisma.task.delete({
			where: {
				id: data.id
			}
		});

		return {
			success: true
		};
	},
	update: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session || !session.user || !session.user.email)
			return fail(401, { message: 'User is not authorized.' });

		const formData = await request.formData();
		const data = taskUpdateSchema.parse(formData);

		const savedTask = await prisma.task.findUnique({
			where: {
				id: data.id
			}
		});

		if (!savedTask || savedTask.userEmail !== session.user.email)
			return fail(403, { message: 'User does not have access to the task.' });

		await prisma.task.update({
			where: {
				id: data.id
			},
			data: {
				name: data.name,
				description: data.description,
				done: data.done
			}
		});

		return {
			success: true
		};
	}
};
