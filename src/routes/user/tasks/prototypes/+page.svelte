<script lang="ts">
	import type { ActionResult } from '@sveltejs/kit';
	import FormPrototype from './form-prototype.svelte';
	import PrototypeList from './prototype-list.svelte';
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

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

<div class="flex flex-col items-center gap-4">
	<FormPrototype data={data.form} />

	<PrototypeList items={data.protos} onUpdatedOrder={updatedOrder} />

	<form action="?/updateOrder" method="POST" bind:this={formElem} onsubmit={handleSubmit}></form>
</div>
