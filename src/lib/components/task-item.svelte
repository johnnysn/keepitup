<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils';
	import { Button, buttonVariants } from './ui/button';
	import { Trash2, ChevronsDown, ChevronsUp, Edit, Repeat } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { onDestroy } from 'svelte';
	import type { AugmentedTask } from '$lib/types/augmented-task';

	type Props = {
		task: AugmentedTask;
	};

	const { task }: Props = $props();
	let editMode = $state(false);

	let form: HTMLFormElement;
	let isPosting = $state(false);
	let doneValue = $state(task.done);

	let timeoutId: number | undefined;
	function checkedChanged(value: boolean | 'indeterminate'): void {
		timeoutId = setTimeout(() => {
			form.requestSubmit();
		}, 200);
	}

	onDestroy(() => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
	});

	const labelClass = $derived(`${task.done ? 'line-through' : ''}`);
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
		<Checkbox size={'lg'} bind:checked={doneValue} onCheckedChange={checkedChanged} />
		<input type="hidden" name="done" bind:value={doneValue} />
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
		<div class="items-top flex gap-1">
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
		</div>
	</div>

	<div class="mt-0.5 flex flex-col gap-1.5 pl-3">
		{#if editMode || (task.description && task.description.length > 0)}
			<input
				type="text"
				name="description"
				class="w-[270px] border-none bg-transparent p-0 text-sm text-foreground/50 focus:text-foreground focus:outline-none focus:ring-0 md:w-full"
				placeholder="Add description here"
				value={task.description}
				onblur={() => form.requestSubmit()}
			/>
		{/if}
		{#if editMode}
			<div class="flex justify-end gap-1.5">
				{#if task.type === 'DAILY'}
					{#if task.recurrent}
						<a
							class="mr-2 flex cursor-pointer items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
							href={`/user/tasks/prototypes?id=${task.recurrent}#proto_item_${task.recurrent}`}
						>
							<Repeat class="size-4" />
							<span>recurrent</span>
						</a>
					{:else}
						<a
							class={cn(
								'flex items-center gap-1.5',
								buttonVariants({ variant: 'outline', size: 'sm' })
							)}
							href={`/user/tasks/prototypes?name=${task.name}`}
						>
							<Repeat class="size-4" />
							<span>Recurrency</span>
						</a>
					{/if}
				{/if}
				<a
					class={cn(
						'flex items-center gap-1.5',
						buttonVariants({ variant: 'secondary', size: 'sm' })
					)}
					href={`/user/tasks/${task.id}`}
				>
					<Edit class="size-4" />
					<span>Edit</span>
				</a>
				<Button
					variant="destructive"
					size="sm"
					type="submit"
					formaction="?/delete"
					disabled={isPosting}
					class="ml-1 flex items-center gap-1.5 md:ml-0"
				>
					<Trash2 class="size-4" />
					<span class="hidden md:block">Delete</span>
				</Button>
			</div>
		{/if}
	</div>
</form>
