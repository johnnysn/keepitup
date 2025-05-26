import {
	simpleTaskSchema,
	taskDeleteSchema,
	taskOrderUpdateSchema,
	taskUpdateSchema
} from '$lib/schemas/task-schema';
import { dailyRoutineService } from '$lib/server/daily-routine-service.js';
import prisma from '$lib/server/prisma';
import taskService from '$lib/server/task-service';
import { atStartOfDay, dateFromDateStr, dateStrFromDate } from '$lib/utils';
import { error, type Actions } from '@sveltejs/kit';
import { superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const taskActions: Actions = {
	create: async (event) => {
		const form = await superValidate(event, zod(simpleTaskSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const session = await event.locals.auth();
		if (!session || !session.user || !session.user.email) error(401, 'User is not authorized.');

		const date = form.data.date
			? atStartOfDay(form.data.date)
			: dateFromDateStr(event.params.date!);
		const order = await taskService.getNextOrder(session.user.email, date);

		await prisma.task.create({
			data: {
				name: form.data.name,
				date,
				userEmail: session.user.email,
				order
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
			error(403, 'User does not have access to the task');

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
		if (!session || !session.user || !session.user.email) error(401, 'User is not authorized');

		const formData = await request.formData();
		const data = taskUpdateSchema.parse(formData);

		const savedTask = await prisma.task.findUnique({
			where: {
				id: data.id
			}
		});

		if (!savedTask || savedTask.userEmail !== session.user.email)
			error(403, 'User does not have access to the task');

		await prisma.task.update({
			where: {
				id: data.id
			},
			data: {
				name: data.name,
				description: data.description ?? '',
				done: data.done
			}
		});

		return {
			success: true
		};
	},
	updateOrder: async ({ request, locals, params }) => {
		const session = await locals.auth();
		if (!session || !session.user || !session.user.email) error(401, 'User is not authorized');

		const formData = await request.formData();
		const data = taskOrderUpdateSchema.parse(formData);

		try {
			await taskService.updateTasksOrder(
				session.user.email,
				dateFromDateStr(params.date!),
				data.ids
			);
		} catch (err) {
			error(400, 'There has been a problem when updating the order of tasks');
		}

		return {
			success: true
		};
	},
	reloadRecurrent: async ({ request, locals, params }) => {
		const session = await locals.auth();
		if (!session || !session.user || !session.user.email) error(401, 'User is not authorized');

		await dailyRoutineService.generateForDate(session.user.email, params.date!);

		return {
			success: true
		};
	}
};
