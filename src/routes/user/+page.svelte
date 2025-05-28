<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	const { data } = $props();
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
			<Card.Content>
				<p>Add progress bar</p>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Floating tasks</Card.Title>
				<Card.Description>Tackle these when you can</Card.Description>
			</Card.Header>
			<Card.Content>
				<p>Add progress bar</p>
			</Card.Content>
		</Card.Root>
	</div>
</div>
