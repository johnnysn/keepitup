import prisma from '$lib/server/prisma';
import { atStartOfDay } from '$lib/utils.js';
import { error } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
	const session = await locals.auth();

	if (!session || !session.user || !session.user.email) error(401, 'User is not authorized.');

	const now = new Date();
	const date = atStartOfDay(new Date());
	const yesterday = new Date(date);
	yesterday.setDate(date.getDate() - 1);

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

	const totalYesterdayTasks = await prisma.task.count({
		where: {
			userEmail: session.user.email,
			type: 'DAILY',
			date: yesterday
		}
	});

	const doneYesterdayTasks = await prisma.task.count({
		where: {
			userEmail: session.user.email,
			type: 'DAILY',
			date: yesterday,
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
		doneFloatingTasks,
		totalYesterdayTasks,
		doneYesterdayTasks
	};
};
