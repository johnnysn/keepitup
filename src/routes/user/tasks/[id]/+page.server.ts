import { simpleTaskSchema } from '$lib/schemas/task-schema';
import prisma from '$lib/server/prisma.js';
import { dateStrFromDate } from '$lib/utils.js';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
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
				date: task.date
			},
			zod(simpleTaskSchema)
		)
	};
};
