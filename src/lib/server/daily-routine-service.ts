import { dateFromDateStr, dateStrFromDate } from '$lib/utils';
import { Prisma, type DailyRoutine, type TaskPrototype } from '@prisma/client';
import prisma from './prisma';

export const dailyRoutineService = {
	async executeLoadingRoutine(userEmail: string, date: Date) {
		const dateStr = dateStrFromDate(date);

		const existingRoutine = await prisma.dailyRoutine.findUnique({
			where: {
				prismaislame: {
					userEmail,
					dateStr
				}
			}
		});

		let routine: DailyRoutine;

		if (!existingRoutine) {
			routine = await prisma.dailyRoutine.create({
				data: {
					dateStr,
					userEmail,
					executed: false
				}
			});
		} else {
			routine = existingRoutine;
		}

		if (routine.executed) return;

		await this.generateForDate(userEmail, dateStr);

		// Mark the routine as executed
		await prisma.dailyRoutine.update({
			where: {
				prismaislame: {
					userEmail,
					dateStr
				}
			},
			data: {
				executed: true
			}
		});
	},

	async generateForDate(userEmail: string, dateStr: string) {
		const reliableDate = dateFromDateStr(dateStr);
		// console.log(reliableDate);

		const day = reliableDate.getUTCDay();
		let weekDayStr = '.......';
		weekDayStr = weekDayStr.slice(0, day) + '1' + weekDayStr.slice(day + 1);
		const regexPattern = '^' + weekDayStr + '$';

		// console.log(`RegEx pattern: ${regexPattern}`);

		const regex = new RegExp(regexPattern);
		const protos = (
			await prisma.taskPrototype.findMany({
				where: {
					userEmail
				},
				orderBy: {
					order: 'asc'
				}
			})
		).filter((p) => regex.test(p.weekDays));
		// const protos = await prisma.$queryRaw<TaskPrototype[]>(Prisma.sql`SELECT * FROM taskprototypes
		// WHERE useremail = ${userEmail} and weekdays ~ ${regexPattern}`);

		if (protos.length !== 0) {
			// Executing daily routine
			const tasks = await prisma.task.findMany({
				where: {
					date: reliableDate,
					userEmail,
					type: 'DAILY'
				}
			});

			const addedNames = new Set(tasks.map((t) => t.name));
			const startingOrder = tasks.length + 1;
			const tasksToAdd: TaskPrototype[] = protos.filter((p) => !addedNames.has(p.name));

			await prisma.$transaction(async (prisma) => {
				let order = startingOrder;
				for (const p of tasksToAdd) {
					await prisma.task.create({
						data: {
							order,
							name: p.name,
							description: p.description,
							date: reliableDate,
							userEmail,
							type: 'DAILY'
						}
					});
					order++;
				}
			});
		}
	}
};
