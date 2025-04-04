<script lang="ts">
	import { enhance } from '$app/forms';
	import { onDestroy } from 'svelte';
	import SimpleTaskForm from './simple-task-form.svelte';
	import TaskList from './task-list.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { page } from '$app/state';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { dateFromDateStr, dateStrFromDate, formatDate } from '$lib/utils';

	let { data } = $props();
	let ids = $state('');
	let form: HTMLFormElement;

	let timeoutId: number | undefined;
	function updatedOrder(items: string[]): void {
		ids = items.join(',');

		timeoutId = setTimeout(() => form.requestSubmit(), 50);
	}

	onDestroy(() => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
	});

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

	<form action="?/updateOrder" method="POST" bind:this={form} use:enhance>
		<input type="hidden" name="ids" bind:value={ids} />
	</form>
</div>
