<script lang="ts">
	import FormPrototype from './form-prototype.svelte';

	let { data } = $props();
</script>

<FormPrototype data={data.form} />

<ul class="mt-4 flex flex-col items-center gap-2">
	{#each data.protos as proto}
		<li class="w-full rounded bg-foreground/10 p-1">{proto.name}</li>
	{/each}
</ul>
