import prisma from './prisma';

const taskService = {
	async getNextOrder(userEmail: string, date: Date) {
		const maxOrder =
			(
				await prisma.task.aggregate({
					_max: {
						order: true
					},
					where: {
						date,
						userEmail
					}
				})
			)._max.order ?? 0;

		const numberOfTasks = await prisma.task.count({
			where: {
				date: date,
				userEmail
			}
		});

		return Math.max(maxOrder + 1, numberOfTasks + 1);
	}
};

export default taskService;
