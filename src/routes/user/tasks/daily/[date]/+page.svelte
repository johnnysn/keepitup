<script lang="ts">
	import { applyAction, deserialize, enhance } from '$app/forms';
	import SimpleTaskForm from './simple-task-form.svelte';
	import TaskList from './task-list.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { page } from '$app/state';
	import { ChevronLeft, ChevronRight, CircleDashed } from 'lucide-svelte';
	import { dateFromDateStr, dateStrFromDate, formatDate } from '$lib/utils';
	import type { ActionResult } from '@sveltejs/kit';
	import { invalidateAll, goto } from '$app/navigation';

	let { data } = $props();
	let ids = $state('');
	let formElem: HTMLFormElement;
	let isLoading = $state(false);

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

	function forward() {
		const date = dateFromDateStr(page.params.date);
		date.setDate(date.getDate() + 1);
		const strDate = dateStrFromDate(date);

		goto(`/user/tasks/daily/${strDate}`);
	}

	function backward() {
		const date = dateFromDateStr(page.params.date);
		date.setDate(date.getDate() - 1);
		const strDate = dateStrFromDate(date);

		goto(`/user/tasks/daily/${strDate}`);
	}
</script>

<div class="flex flex-col items-center gap-4">
	<div class="flex items-center justify-center gap-6">
		<Button variant={'outline'} size={'icon'} onclick={() => backward()}><ChevronLeft /></Button>
		<span class="font-semibold">{formatDate(dateFromDateStr(page.params.date))}</span>
		<Button variant={'outline'} size={'icon'} onclick={() => forward()}><ChevronRight /></Button>
	</div>

	<SimpleTaskForm data={data.form} />

	<TaskList items={data.tasks} onUpdatedOrder={updatedOrder} />

	<form action="?/updateOrder" method="POST" bind:this={formElem} onsubmit={handleSubmit}></form>

	{#if data.allowLoadingDailyTasks}
		<form
			class="mt-2 flex w-full max-w-screen-sm justify-end"
			method="POST"
			action="?/reloadRecurrent"
			use:enhance={() => {
				isLoading = true;
				return async ({ result, update }) => {
					update({ reset: false });
					isLoading = false;
				};
			}}
		>
			<Button
				variant="outline"
				class="flex items-center gap-1.5"
				disabled={isLoading}
				type="submit"
			>
				<CircleDashed class="size-4" />
				<span>Load recurrent tasks</span>
			</Button>
		</form>
	{/if}
</div>
