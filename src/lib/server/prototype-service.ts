import type { TaskPrototype } from '@prisma/client';
import prisma from './prisma';

export const prototypeService = {
	async getNextOrder(userEmail: string) {
		const maxOrder =
			(
				await prisma.taskPrototype.aggregate({
					_max: {
						order: true
					},
					where: {
						userEmail
					}
				})
			)._max.order ?? 0;

		const numberOfProtos = await prisma.taskPrototype.count({
			where: {
				userEmail
			}
		});

		return Math.max(maxOrder + 1, numberOfProtos + 1);
	},

	async updatePrototypesOrder(userEmail: string, ids: string[]) {
		const savedProtos = await prisma.taskPrototype.findMany({
			where: {
				userEmail
			}
		});

		const map = new Map<string, TaskPrototype>();
		const marked = new Set<string>();
		savedProtos.forEach((p) => map.set(p.id, p));

		let order = 1;
		for (const id of ids) {
			if (!map.has(id)) throw new Error('The prototype does not belong to the set');
			if (marked.has(id)) throw new Error('Duplicated prototype');

			const proto = map.get(id)!;
			proto.order = order;
			marked.add(id);

			order += 1;
		}

		await prisma.$transaction(async (prisma) => {
			for (const t of savedProtos.values()) {
				await prisma.taskPrototype.update({
					where: {
						id: t.id
					},
					data: {
						order: t.order
					}
				});
			}
		});
	}
};
