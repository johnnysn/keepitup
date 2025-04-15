<script lang="ts">
	import type { ActionResult } from '@sveltejs/kit';
	import FormPrototype from './form-prototype.svelte';
	import PrototypeList from './prototype-list.svelte';
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { ChevronsUpDown } from 'lucide-svelte';

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
	<Collapsible.Root class="flex w-full max-w-screen-sm flex-col items-center">
		<Collapsible.Trigger asChild let:builder>
			<Button builders={[builder]} variant="ghost" size="sm" class="flex w-full items-center gap-4">
				<span>Add new recurrent task</span>
				<ChevronsUpDown class="h-4 w-4" />
			</Button>
		</Collapsible.Trigger>
		<Collapsible.Content class="flex w-full flex-col items-center">
			<FormPrototype data={data.form} />
		</Collapsible.Content>
	</Collapsible.Root>

	<PrototypeList items={data.protos} onUpdatedOrder={updatedOrder} />

	<form action="?/updateOrder" method="POST" bind:this={formElem} onsubmit={handleSubmit}></form>
</div>
