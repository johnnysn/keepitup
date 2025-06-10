<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dragHandleZone, dragHandle, type DndEvent } from 'svelte-dnd-action';
	import type { TaskPrototype } from '@prisma/client';
	import { GripVertical } from 'lucide-svelte';
	import PrototypeItem from './prototype-item.svelte';

	type Props = {
		items: TaskPrototype[];
		onUpdatedOrder: (items: string[]) => void;
		targetId: string | null | undefined;
	};

	let { items, onUpdatedOrder, targetId }: Props = $props();

	const flipDurationMs = 300;
	function handleDndConsider(e: CustomEvent<DndEvent<TaskPrototype>>) {
		items = e.detail.items;
	}
	function handleDndFinalize(e: CustomEvent<DndEvent<TaskPrototype>>) {
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
	{#each items as item (item.id)}
		<li
			id={`proto_item_${item.id}`}
			animate:flip={{ duration: flipDurationMs }}
			class="flex w-full max-w-screen-sm items-center rounded border border-transparent bg-background/40 hover:border-border"
		>
			<div use:dragHandle class="mx-1 text-foreground/50 hover:text-foreground">
				<GripVertical class="size-6" />
			</div>
			<PrototypeItem prototype={item} open={targetId === item.id} />
		</li>
	{/each}
</ul>
