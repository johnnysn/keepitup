import { simpleTaskSchema } from '$lib/schemas/task-schema';
import { dailyRoutineService } from '$lib/server/daily-routine-service.js';
import prisma from '$lib/server/prisma';
import { taskActions } from '$lib/server/task-actions.js';
import { dateFromDateStr, dateStrFromDate } from '$lib/utils';
import { error, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params, locals }) => {
	const date = dateFromDateStr(params.date);
	const session = await locals.auth();

	if (!session || !session.user || !session.user.email) error(401, 'User is not authorized.');
	const userEmail = session.user.email;

	let allowLoadingDailyTasks = false;
	const today = new Date();
	if (params.date === dateStrFromDate(today)) {
		// console.log('Generating recurrent tasks');
		await dailyRoutineService.executeLoadingRoutine(userEmail, today);
	} else if (dateFromDateStr(params.date).getTime() > today.getTime()) {
		allowLoadingDailyTasks = true;
	}

	const [tasks, prototypes] = await Promise.all([
		prisma.task.findMany({
			where: {
				userEmail,
				date
			},
			orderBy: {
				order: 'asc'
			}
		}),
		prisma.taskPrototype.findMany({
			where: {
				userEmail
			},
			select: {
				name: true
			}
		})
	]);

	const prototypeNames = new Set(prototypes.map((p) => p.name));

	const tasksWithPrototypeFlag = tasks.map((task) => ({
		...task,
		recurrent: prototypeNames.has(task.name)
	}));

	return {
		tasks: tasksWithPrototypeFlag,
		form: await superValidate(zod(simpleTaskSchema)),
		allowLoadingDailyTasks
	};
};

export const actions: Actions = taskActions;
