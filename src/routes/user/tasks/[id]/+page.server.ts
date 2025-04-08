import { formTaskSchema, simpleTaskSchema } from '$lib/schemas/task-schema';
import prisma from '$lib/server/prisma.js';
import { dateFromDateStr, dateStrFromDate } from '$lib/utils.js';
import { error, type Actions } from '@sveltejs/kit';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params, locals }) => {
	const id = params.id;
	const task = await prisma.task.findUnique({ where: { id } });
	const session = await locals.auth();

	if (!task) {
		error(404, {
			message: 'Task not found'
		});
	}

	if (!session || !session.user || session.user.email !== task.userEmail)
		error(403, {
			message: 'You have no access to this task'
		});

	return {
		task,
		form: await superValidate(
			{
				name: task.name,
				description: task.description ?? undefined,
				date: dateStrFromDate(task.date)
			},
			zod(formTaskSchema)
		)
	};
};

export const actions: Actions = {
	update: async (event) => {
		const form = await superValidate(event, zod(formTaskSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const session = await event.locals.auth();
		if (!session || !session.user || !session.user.email) error(401, 'User is not authorized.');

		const id = event.params.id!;
		const savedTask = await prisma.task.findUnique({
			where: {
				id
			}
		});

		if (!savedTask || savedTask.userEmail !== session.user.email)
			return fail(403, { message: 'User does not have access to the task.' });

		await prisma.task.update({
			data: {
				name: form.data.name,
				date: dateFromDateStr(form.data.date),
				description: form.data.description
			},
			where: {
				id
			}
		});

		return {
			form
		};
	}
};
