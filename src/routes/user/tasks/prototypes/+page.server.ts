import prisma from '$lib/server/prisma.js';
import { error, type Actions } from '@sveltejs/kit';
import { superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { prototypeFormSchema } from '$lib/schemas/prototype-schema';

export const load = async ({ locals }) => {
	const session = await locals.auth();

	if (!session || !session.user || !session.user.email) error(401, 'User is not authorized.');

	const protos = await prisma.taskPrototype.findMany({
		where: {
			userEmail: session.user.email
		},
		orderBy: [
			{
				order: 'asc'
			}
		]
	});

	return {
		protos,
		form: await superValidate(zod(prototypeFormSchema))
	};
};

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event, zod(prototypeFormSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const session = await event.locals.auth();
		if (!session || !session.user || !session.user.email) error(401, 'User is not authorized.');

		const existing = await prisma.taskPrototype.findUnique({
			where: {
				name: form.data.name,
				userEmail: session.user.email
			}
		});

		if (existing) {
			error(400, 'Task name already exists.');
		}

		const weekDays = [
			form.data.sunday ? '1' : '0',
			form.data.monday ? '1' : '0',
			form.data.tuesday ? '1' : '0',
			form.data.wednesday ? '1' : '0',
			form.data.thursday ? '1' : '0',
			form.data.friday ? '1' : '0',
			form.data.saturday ? '1' : '0'
		].join('');

		await prisma.taskPrototype.create({
			data: {
				name: form.data.name,
				description: form.data.description,
				weekDays,
				userEmail: session.user.email
			}
		});

		return {
			form
		};
	}
};
