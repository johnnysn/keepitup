import prisma from '$lib/server/prisma.js';
import { error, type Actions } from '@sveltejs/kit';
import { superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	prototypeDeleteSchema,
	prototypeFormSchema,
	prototypeOrderUpdateSchema
} from '$lib/schemas/prototype-schema';
import { prototypeService } from '$lib/server/prototype-service.js';

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

		if (form.data.weekDays === '0000000') error(400, 'You should select at least one week day');

		const order = await prototypeService.getNextOrder(session.user.email);

		await prisma.taskPrototype.create({
			data: {
				name: form.data.name,
				description: form.data.description,
				weekDays: form.data.weekDays,
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
		const data = prototypeDeleteSchema.parse(formData);

		const prototype = await prisma.taskPrototype.findUnique({
			where: {
				id: data.id
			}
		});

		if (!prototype || prototype.userEmail !== session.user.email)
			error(403, 'User does not have access to the prototype');

		await prisma.taskPrototype.delete({
			where: {
				id: data.id
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
		const data = prototypeOrderUpdateSchema.parse(formData);

		try {
			await prototypeService.updatePrototypesOrder(session.user.email, data.ids);
		} catch (err) {
			error(400, 'There has been a problem when updating the order of prototypes');
		}

		return {
			success: true
		};
	}
};
