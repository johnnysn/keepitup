<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { cn, formatWeekDay } from '$lib/utils';
	import type { TaskPrototype } from '@prisma/client';
	import { ChevronsDown, ChevronsUp, Edit, Trash2 } from 'lucide-svelte';
	import WeekdaysMarker from './weekdays-marker.svelte';
	import { onDestroy } from 'svelte';

	type Props = {
		prototype: TaskPrototype;
		open: boolean;
	};

	let { prototype, open }: Props = $props();

	let isPosting = $state(false);
	let form: HTMLFormElement;

	let weekDays = $state(prototype.weekDays);

	let timeoutId: number | undefined;
	function checkChangedHandler(day: number, value: boolean): void {
		weekDays = formatWeekDay(weekDays, day, value);
		timeoutId = setTimeout(() => form.requestSubmit(), 50);
	}

	onDestroy(() => {
		if (timeoutId) clearTimeout(timeoutId);
	});
</script>

<form
	action="?/simpleUpdate"
	method="POST"
	class="flex w-full flex-col px-2 py-1"
	bind:this={form}
	use:enhance={({ cancel }) => {
		if (isPosting) {
			cancel();
		} else {
			isPosting = true;
		}

		return async ({ update }) => {
			update({ reset: false });
			isPosting = false;
		};
	}}
>
	<input type="hidden" name="id" value={prototype.id} />
	<div class="flex w-full items-center space-x-2">
		<div class="flex-1 leading-none">
			<Label
				class={`text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
			>
				<input
					type="text"
					name="name"
					class={cn(
						'w-[180px] border-none bg-transparent p-0 text-sm text-foreground focus:text-foreground focus:outline-none focus:ring-0 md:w-full md:text-base'
					)}
					value={prototype.name}
					onblur={() => form.requestSubmit()}
					required
				/>
			</Label>
			<input type="hidden" name="weekDays" bind:value={weekDays} />
		</div>
		<div class="items-top flex gap-1">
			<Button
				variant="outline"
				size="icon"
				on:click={() => {
					open = !open;
				}}
			>
				{#if open}
					<ChevronsUp class="size-4" />
				{:else}
					<ChevronsDown class="size-4" />
				{/if}
			</Button>
			<button type="submit" class="hidden">Update</button>
		</div>
	</div>

	<div class="mt-0.5 flex flex-col gap-1.5 pl-3">
		{#if open || (prototype.description && prototype.description.length > 0)}
			<input
				type="text"
				name="description"
				class="w-[270px] border-none bg-transparent p-0 text-sm text-foreground/50 focus:text-foreground focus:outline-none focus:ring-0 md:w-full"
				placeholder="Add description here"
				value={prototype.description}
				onblur={() => form.requestSubmit()}
			/>
		{/if}
		{#if open}
			<div class="flex flex-col">
				<WeekdaysMarker weekDays={prototype.weekDays} onCheckChanged={checkChangedHandler} />
				<div class="flex justify-end gap-1.5">
					<Button
						variant="outline"
						size="sm"
						type="submit"
						formaction="?/delete"
						disabled={isPosting}
						class="flex items-center gap-1.5"
					>
						<Trash2 class="size-4" />
						<span>Delete rec. task</span>
					</Button>
				</div>
			</div>
		{/if}
	</div>
</form>
