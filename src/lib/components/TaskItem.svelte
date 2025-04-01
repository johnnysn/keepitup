<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils';
	import type { Task } from '@prisma/client';
	import { Button } from './ui/button';
	import { Trash2, ChevronsDown, ChevronsUp } from 'lucide-svelte';
	import { enhance } from '$app/forms';

	type Props = {
		task: Task;
	};

	const { task }: Props = $props();

	const labelClass = '';
	let editMode = $state(false);
</script>

<form class="flex w-full flex-col px-2 py-1" method="POST" action="?/delete" use:enhance>
	<input type="hidden" name="id" value={task.id} />
	<div class="flex w-full items-center space-x-2">
		<Checkbox size={'lg'} />
		<div class="grid flex-1 items-center gap-1.5 leading-none">
			<Label
				class={`text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${labelClass}`}
			>
				<input
					type="text"
					name="name"
					class={cn(
						'w-[180px] border-none bg-transparent p-0 text-foreground focus:text-foreground focus:outline-none focus:ring-0 md:w-full',
						labelClass
					)}
					value={task.name}
				/>
			</Label>
		</div>
		<div class="items-top flex w-[80px] gap-1">
			<Button
				variant="outline"
				size="icon"
				on:click={() => {
					editMode = !editMode;
				}}
			>
				{#if editMode}
					<ChevronsUp class="size-4" />
				{:else}
					<ChevronsDown class="size-4" />
				{/if}
			</Button>
			<Button variant="outline" size="icon" type="submit" formaction="?/delete">
				<Trash2 class="size-4" />
			</Button>
		</div>
	</div>
</form>
