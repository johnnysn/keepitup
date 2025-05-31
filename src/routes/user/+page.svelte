<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { ListChecks } from 'lucide-svelte';
	const { data } = $props();

	let dailyProgress = $derived(
		data.totalDailyTasks > 0 ? Math.round((data.doneDailyTasks / data.totalDailyTasks) * 100) : 0
	);
	let floatingProgress = $derived(
		data.totalFloatingTasks > 0
			? Math.round((data.doneFloatingTasks / data.totalFloatingTasks) * 100)
			: 0
	);
</script>

<div class="flex flex-col items-center">
	<h1 class="mb-1 text-2xl font-bold">Dashboard</h1>

	<p class="mb-4 text-muted-foreground">Welcome, {data.session?.user?.name}!</p>

	<div class="flex flex-wrap justify-center gap-4">
		<Card.Root>
			<Card.Header>
				<Card.Title>TODO list</Card.Title>
				<Card.Description>Progress with today's tasks</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-col gap-3">
				<div class="flex items-center justify-end gap-2">
					<ListChecks class="size-6 text-lime-600" />
					<span>{data.doneDailyTasks} / {data.totalDailyTasks}</span>
				</div>
				<div class="h-6 w-full overflow-hidden rounded-full bg-primary/20">
					<div
						class="h-full bg-gradient-to-r from-blue-500 to-purple-600"
						style="width: {dailyProgress}%"
					></div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Floating tasks</Card.Title>
				<Card.Description>Tackle these when you can</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-col gap-3">
				<div class="flex items-center justify-end gap-2">
					<ListChecks class="size-6 text-lime-600" />
					<span>{data.doneFloatingTasks} / {data.totalFloatingTasks}</span>
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
