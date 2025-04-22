<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dragHandleZone, dragHandle, type DndEvent } from 'svelte-dnd-action';
	import type { Task } from '@prisma/client';
	import TaskItem from './task-item.svelte';
	import { GripVertical } from 'lucide-svelte';

	type Props = {
		items: Task[];
		onUpdatedOrder: (items: string[]) => void;
	};

	let { items, onUpdatedOrder }: Props = $props();

	const flipDurationMs = 300;
	function handleDndConsider(e: CustomEvent<DndEvent<Task>>) {
		items = e.detail.items;
	}
	function handleDndFinalize(e: CustomEvent<DndEvent<Task>>) {
		items = e.detail.items;
		onUpdatedOrder(items.map((i) => i.id));
	}
</script>

<ul
	use:dragHandleZone={{ items, flipDurationMs, dragDisabled: true }}
	onconsider={handleDndConsider}
	onfinalize={handleDndFinalize}
	class="flex w-full flex-col items-center gap-1.5 pb-2 pt-4"
>
	{#if items.length > 0}
		{#each items as item (item.id)}
			<li
				animate:flip={{ duration: flipDurationMs }}
				class="flex w-full max-w-screen-sm items-center rounded border border-transparent bg-background/40 hover:border-border"
			>
				<div use:dragHandle class="mx-1 text-foreground/50 hover:text-foreground">
					<GripVertical class="size-6" />
				</div>
				<TaskItem task={item} />
			</li>
		{/each}
	{:else}
		No tasks for today 😀
	{/if}
</ul>
