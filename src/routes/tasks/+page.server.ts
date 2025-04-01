import prisma from '$lib/server/prisma';

export async function load() {
	return {
		tasks: await prisma.task.findMany()
	};
}
