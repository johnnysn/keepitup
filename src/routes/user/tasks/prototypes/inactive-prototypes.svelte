<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import type { TaskPrototype } from '@prisma/client';
	import { ArchiveRestore } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	interface Props {
		prototypes: TaskPrototype[];
	}

	let { prototypes }: Props = $props();
</script>

<ul class="flex w-full flex-col items-center gap-1">
	{#each prototypes as proto (proto.id)}
		<li
			transition:fade
			class="flex w-full max-w-screen-sm items-center rounded border border-transparent bg-background/40 hover:border-border"
		>
			<form
				method="POST"
				class="flex w-full items-center justify-between px-3 py-2"
				action="?/activation"
				use:enhance
			>
				<span class="text-muted-foreground">{proto.name}</span>
				<input type="hidden" name="id" value={proto.id} />
				<input type="hidden" name="active" value="true" />
				<Button variant="outline" size="sm" type="submit" class="flex items-center gap-1.5">
					<ArchiveRestore class="size-4" />
					<span>Reactivate</span>
				</Button>
			</form>
		</li>
	{/each}
</ul>
