<script lang="ts">
	import { enhance } from '$app/forms';
	import { onDestroy } from 'svelte';
	import SimpleTaskForm from './simple-task-form.svelte';
	import TaskList from './task-list.svelte';

	let { data } = $props();
	let ids = $state('');
	let form: HTMLFormElement;

	let timeoutId: number | undefined;
	function updatedOrder(items: string[]): void {
		ids = items.join(',');

		timeoutId = setTimeout(() => form.requestSubmit(), 100);
	}

	onDestroy(() => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
	});
</script>

<div class="flex flex-col items-center gap-4">
	<SimpleTaskForm data={data.form} />

	<TaskList items={data.tasks} onUpdatedOrder={updatedOrder} />

	<form action="?/updateOrder" method="POST" bind:this={form} use:enhance>
		<input type="hidden" name="ids" bind:value={ids} />
	</form>
</div>
