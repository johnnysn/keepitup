import prisma from '$lib/server/prisma.js';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { superValidate, fail } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	prototypeActivationSchema,
	prototypeDeleteSchema,
	prototypeFormSchema,
	prototypeOrderUpdateSchema,
	prototypeSimpleUpdateSchema
} from '$lib/schemas/prototype-schema';
import { prototypeService } from '$lib/server/prototype-service.js';

export const load = async ({ locals, url }) => {
	const session = await locals.auth();
	const name = url.searchParams.get('name');
	const id = url.searchParams.get('id');

	if (!session || !session.user || !session.user.email) error(401, 'User is not authorized.');

	const protos = await prisma.taskPrototype.findMany({
		where: {
			userEmail: session.user.email,
			active: true
		},
		orderBy: [
			{
				order: 'asc'
			}
		]
	});

	const inactiveProtos = await prisma.taskPrototype.findMany({
		where: {
			userEmail: session.user.email,
			active: false
		},
		orderBy: [
			{
				order: 'asc'
			}
		]
	});

	let prefilledValues = undefined;

	if (name) {
		prefilledValues = {
			name
		};
	}

	return {
		protos,
		inactiveProtos,
		form: await superValidate(prefilledValues, zod(prototypeFormSchema))
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

		// console.log(form.data.weekDays);
		if (form.data.weekDays === '0000000')
			error(400, 'You should select at least one day of the week');

		const order = await prototypeService.getNextOrder(session.user.email);

		await prisma.taskPrototype.create({
			data: {
				name: form.data.name,
				description: form.data.description,
				weekDays: form.data.weekDays,
				userEmail: session.user.email,
				remainingCount: form.data.remainingCount ?? null,
				active: true,
				order
			}
		});

		throw redirect(303, event.url.pathname);
		// return {
		// 	form
		// };
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
	simpleUpdate: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session || !session.user || !session.user.email) error(401, 'User is not authorized.');

		const formData = await request.formData();
		const data = prototypeSimpleUpdateSchema.parse(formData);

		const prototype = await prisma.taskPrototype.findUnique({
			where: {
				id: data.id
			}
		});

		if (!prototype || prototype.userEmail !== session.user.email)
			error(403, 'User does not have access to the prototype');

		if (data.weekDays === '0000000') error(400, 'You should select at least one day of the week');

		await prisma.taskPrototype.update({
			where: {
				id: data.id
			},
			data: {
				name: data.name,
				description: data.description ?? '',
				weekDays: data.weekDays,
				remainingCount: data.remainingCount ?? null
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
	},
	activation: async ({ request, locals }) => {
		const session = await locals.auth();
		if (!session || !session.user || !session.user.email) error(401, 'User is not authorized.');

		const formData = await request.formData();
		const data = prototypeActivationSchema.parse(formData);

		const prototype = await prisma.taskPrototype.findUnique({
			where: {
				id: data.id
			}
		});

		if (!prototype || prototype.userEmail !== session.user.email)
			error(403, 'User does not have access to the prototype');

		await prisma.taskPrototype.update({
			data: {
				active: data.active
			},
			where: {
				id: data.id
			}
		});

		return {
			success: true
		};
	}
};
