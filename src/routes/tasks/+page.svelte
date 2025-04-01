<script lang="ts">
	import TaskItem from '$lib/components/TaskItem.svelte';
	import SimpleTaskForm from './simple-task-form.svelte';

	let { data } = $props();
</script>

<div class="flex flex-col gap-4">
	<SimpleTaskForm data={data.form} />

	<ul class="flex flex-col">
		{#each data.tasks as task (task.id)}
			<li>
				<TaskItem {task} />
			</li>
		{/each}
	</ul>
</div>
