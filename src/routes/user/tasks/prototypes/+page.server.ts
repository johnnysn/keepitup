import prisma from '$lib/server/prisma.js';
import { error, type Actions } from '@sveltejs/kit';
import { superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { prototypeDeleteSchema, prototypeFormSchema } from '$lib/schemas/prototype-schema';

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
				prismaislame: {
					name: form.data.name,
					userEmail: session.user.email
				}
			}
		});

		if (existing) {
			error(400, 'Task name already exists.');
		}

		// console.log(form.data);

		const weekDays = [
			form.data.sunday ? '1' : '0',
			form.data.monday ? '1' : '0',
			form.data.tuesday ? '1' : '0',
			form.data.wednesday ? '1' : '0',
			form.data.thursday ? '1' : '0',
			form.data.friday ? '1' : '0',
			form.data.saturday ? '1' : '0'
		].join('');

		// if (weekDays === '0000000') error(400, 'You should select at least one week day');

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
	},
	delete: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session || !session.user || !session.user.email) error(401, 'User is not authorized.');

		const formData = await request.formData();
		const data = prototypeDeleteSchema.parse(formData);

		const prototype = await prisma.taskPrototype.findUnique({
			where: {
				id: data.id
			}
		});

		if (!prototype || prototype.userEmail !== session.user.email)
			return fail(403, { message: 'User does not have access to the prototype.' });

		await prisma.taskPrototype.delete({
			where: {
				id: data.id
			}
		});

		return {
			success: true
		};
	}
};
