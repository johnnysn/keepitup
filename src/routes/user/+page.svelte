<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { dateFromDateStr, dateStrFromDate } from '$lib/utils';
	import { ListChecks } from 'lucide-svelte';
	const { data } = $props();

	let dailyProgress = $derived(
		data.totalDailyTasks > 0 ? Math.round((data.doneDailyTasks / data.totalDailyTasks) * 100) : 0
	);
	let dailyYesterdayProgress = $derived(
		data.totalYesterdayTasks > 0
			? Math.round((data.doneYesterdayTasks / data.totalYesterdayTasks) * 100)
			: 0
	);
	let floatingProgress = $derived(
		data.totalFloatingTasks > 0
			? Math.round((data.doneFloatingTasks / data.totalFloatingTasks) * 100)
			: 0
	);

	const today = new Date();
	const todayStr = dateStrFromDate(today);
	const yesterday = dateFromDateStr(todayStr);
	yesterday.setDate(yesterday.getDate() - 1);
	const yesterdayStr = dateStrFromDate(yesterday);
</script>

<div class="flex flex-col items-center">
	<h1 class="mb-1 text-2xl font-bold">Dashboard</h1>

	<p class="mb-4 text-muted-foreground">Welcome, {data.session?.user?.name}!</p>

	<div class="flex flex-wrap justify-center gap-4">
		<div class="card">
			<Card.Root>
				<Card.Header>
					<Card.Title>
						<a href="/user/tasks/daily/{yesterdayStr}">Yesterdays's tasks</a>
					</Card.Title>
					<Card.Description>Review what was left unfinished</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-col gap-3">
					<div class="flex items-end justify-between">
						<img src="/knight_back1.png" alt="Knight looking back" class="h-[80px]" />
						<div class="flex items-center justify-end gap-2">
							<a href="/user/tasks/daily/{yesterdayStr}"
								><ListChecks class="size-6 text-lime-600" /></a
							>
							<span>{data.doneDailyTasks} / {data.totalDailyTasks}</span>
						</div>
					</div>
					<div class="h-6 w-full overflow-hidden rounded-full bg-primary/20">
						<div
							class="h-full bg-gradient-to-r from-blue-500 to-purple-600"
							style="width: {dailyYesterdayProgress}%"
						></div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<div class="card">
			<Card.Root>
				<Card.Header>
					<Card.Title>
						<a href="/user/tasks/daily/{todayStr}">Today's tasks</a>
					</Card.Title>
					<Card.Description>TODO list for today</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-col gap-3">
					<div class="flex items-end justify-between">
						<img src="/knight_attack1.png" alt="Knight looking back" class="h-[80px]" />
						<div class="flex items-center justify-end gap-2">
							<a href="/user/tasks/daily/{todayStr}"><ListChecks class="size-6 text-lime-600" /></a>
							<span>{data.doneDailyTasks} / {data.totalDailyTasks}</span>
						</div>
					</div>

					<div class="h-6 w-full overflow-hidden rounded-full bg-primary/20">
						<div
							class="h-full bg-gradient-to-r from-blue-500 to-purple-600"
							style="width: {dailyProgress}%"
						></div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<div class="card">
			<Card.Root>
				<Card.Header>
					<Card.Title>
						<a href="/user/tasks/floating">Floating tasks</a>
					</Card.Title>
					<Card.Description>Tackle these when you can</Card.Description>
				</Card.Header>
				<Card.Content class="flex flex-col gap-3">
					<div class="flex items-end justify-between">
						<img src="/knight_forward1.png" alt="Knight looking back" class="h-[80px]" />
						<div class="flex items-center justify-end gap-2">
							<a href="/user/tasks/floating"><ListChecks class="size-6 text-lime-600" /></a>
							<span>{data.doneFloatingTasks} / {data.totalFloatingTasks}</span>
						</div>
					</div>

					<div class="h-6 w-full overflow-hidden rounded-full bg-primary/20">
						<div
							class="h-full bg-gradient-to-r from-blue-500 to-purple-600"
							style="width: {floatingProgress}%"
						></div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>

<style>
	.card {
		width: 280px;
	}
</style>
