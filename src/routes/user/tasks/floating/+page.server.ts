import { simpleTaskSchema } from '$lib/schemas/task-schema';
import prisma from '$lib/server/prisma';
import { taskActions } from '$lib/server/task-actions';
import { error } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params, locals }) => {
	const session = await locals.auth();

	if (!session || !session.user || !session.user.email) error(401, 'User is not authorized.');
	const userEmail = session.user.email;

	const tasks = await prisma.task.findMany({
		where: {
			userEmail,
			type: 'FLOATING'
		},
		orderBy: {
			order: 'asc'
		}
	});

	const tasksWithPrototypeFlag = tasks.map((task) => ({
		...task,
		recurrent: false
	}));

	return {
		tasks: tasksWithPrototypeFlag,
		form: await superValidate(zod(simpleTaskSchema))
	};
};

export const actions = taskActions;
