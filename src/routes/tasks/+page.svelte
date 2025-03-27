<script lang="ts">
	let { data } = $props();
</script>

<ul class="flex flex-col">
	{#each data.tasks as task (task.id)}
		<span>{task.name}</span>
	{/each}
</ul>
