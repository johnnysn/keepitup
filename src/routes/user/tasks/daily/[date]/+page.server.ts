import {
	simpleTaskSchema,
	taskDeleteSchema,
	taskOrderUpdateSchema,
	taskUpdateSchema
} from '$lib/schemas/task-schema';
import prisma from '$lib/server/prisma';
import taskService from '$lib/server/task-service';
import { atStartOfDay, dateFromDateStr } from '$lib/utils';
import { fail, error, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ params }) => {
	const date = dateFromDateStr(params.date);

	return {
		tasks: await prisma.task.findMany({
			where: {
				date
			},
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
};

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
	},
	updateOrder: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session || !session.user || !session.user.email)
			return fail(401, { message: 'User is not authorized.' });

		const formData = await request.formData();
		const data = taskOrderUpdateSchema.parse(formData);

		taskService.updateTasksOrder(session.user.email, atStartOfDay(new Date()), data.ids);

		return {
			success: true
		};
	}
};
