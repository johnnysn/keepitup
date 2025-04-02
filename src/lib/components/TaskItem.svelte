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

	let form: HTMLFormElement;
	let isPosting = $state(false);
</script>

<form
	bind:this={form}
	class="flex w-full flex-col px-2 py-1"
	method="POST"
	action="?/update"
	use:enhance={({ formElement, formData, action, cancel, submitter }) => {
		if (isPosting) {
			cancel();
		} else {
			isPosting = true;
		}
		return async ({ result, update }) => {
			update({ reset: false });
			isPosting = false;
		};
	}}
>
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
						'w-[180px] border-none bg-transparent p-0 text-sm text-foreground focus:text-foreground focus:outline-none focus:ring-0 md:w-full md:text-base',
						labelClass
					)}
					value={task.name}
					onblur={() => form.requestSubmit()}
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
			<button type="submit" class="hidden">Update</button>
			<Button
				variant="outline"
				size="icon"
				type="submit"
				formaction="?/delete"
				disabled={isPosting}
			>
				<Trash2 class="size-4" />
			</Button>
		</div>
	</div>

	{#if editMode}
		<div class="mt-2 flex flex-col gap-1.5 pl-3">
			<input
				type="text"
				name="description"
				class="w-[270px] border-none bg-transparent p-0 text-sm text-foreground/50 focus:text-foreground focus:outline-none focus:ring-0 md:w-full"
				placeholder="Add description here"
				value={task.description}
				onblur={() => form.requestSubmit()}
			/>
		</div>
	{/if}
</form>
