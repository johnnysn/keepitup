<script lang="ts">
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import SimpleTaskForm from '$lib/components/simple-task-form.svelte';
	import TaskList from '$lib/components/task-list.svelte';
	import type { ActionResult } from '@sveltejs/kit';

	let { data } = $props();
	let ids = $state('');
	let formElem: HTMLFormElement;

	function updatedOrder(items: string[]): void {
		ids = items.join(',');

		formElem.requestSubmit();
	}

	async function handleSubmit(
		event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }
	) {
		event.preventDefault();
		const formData = new FormData();
		formData.append('ids', ids);
		formData.append('type', 'FLOATING');

		const response = await fetch(event.currentTarget.action, {
			method: 'POST',
			body: formData
		});
		const result: ActionResult = deserialize(await response.text());

		if (result.type === 'success') {
			await invalidateAll();
		}

		applyAction(result);
	}
</script>

<div class="flex flex-col items-center">
	<h1 class="text-2xl font-bold">Floating tasks</h1>
	<p class="mb-4 text-sm text-muted-foreground">You just solve these whenever it's possible</p>

	<SimpleTaskForm data={data.form} floating={true} />

	<TaskList items={data.tasks} onUpdatedOrder={updatedOrder} />

	<form action="?/updateOrder" method="POST" bind:this={formElem} onsubmit={handleSubmit}></form>
</div>
