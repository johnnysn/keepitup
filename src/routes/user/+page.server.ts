import prisma from '$lib/server/prisma';
import { atStartOfDay } from '$lib/utils.js';
import { error } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
	const session = await locals.auth();

	if (!session || !session.user || !session.user.email) error(401, 'User is not authorized.');

	const date = atStartOfDay(new Date());

	const totalDailyTasks = await prisma.task.count({
		where: {
			userEmail: session.user.email,
			type: 'DAILY',
			date
		}
	});

	const doneDailyTasks = await prisma.task.count({
		where: {
			userEmail: session.user.email,
			type: 'DAILY',
			date,
			done: true
		}
	});

	const totalFloatingTasks = await prisma.task.count({
		where: {
			userEmail: session.user.email,
			type: 'FLOATING'
		}
	});

	const doneFloatingTasks = await prisma.task.count({
		where: {
			userEmail: session.user.email,
			type: 'FLOATING',
			done: true
		}
	});

	return {
		totalDailyTasks,
		doneDailyTasks,
		totalFloatingTasks,
		doneFloatingTasks
	};
};
