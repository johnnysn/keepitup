import type { Task, TaskType } from '@prisma/client';
import prisma from './prisma';

const taskService = {
	async getNextOrder(userEmail: string, date: Date, type: TaskType) {
		const maxOrder =
			(
				await prisma.task.aggregate({
					_max: {
						order: true
					},
					where: {
						date,
						userEmail,
						type
					}
				})
			)._max.order ?? 0;

		const numberOfTasks = await prisma.task.count({
			where: {
				date: date,
				userEmail,
				type
			}
		});

		return Math.max(maxOrder + 1, numberOfTasks + 1);
	},

	async updateTasksOrder(userEmail: string, date: Date, ids: string[], type: TaskType) {
		const savedTasks = await prisma.task.findMany({
			where: {
				userEmail,
				type,
				...(type === 'DAILY' && { date })
			}
		});

		const map = new Map<string, Task>();
		const marked = new Set<string>();
		savedTasks.forEach((t) => map.set(t.id, t));

		let order = 1;
		for (const id of ids) {
			if (!map.has(id)) throw new Error('The task does not belong to the set');
			if (marked.has(id)) throw new Error('Duplicated task');

			const task = map.get(id)!;
			task.order = order;
			marked.add(id);

			order += 1;
		}

		await prisma.$transaction(async (prisma) => {
			for (const t of savedTasks.values()) {
				await prisma.task.update({
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

export default taskService;
