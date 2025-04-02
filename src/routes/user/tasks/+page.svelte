<script lang="ts">
	import SimpleTaskForm from './simple-task-form.svelte';
	import TaskList from './task-list.svelte';

	let { data } = $props();
</script>

<div class="flex flex-col items-center gap-4">
	<SimpleTaskForm data={data.form} />

	<TaskList items={data.tasks} onUpdatedOrder={() => console.log('Changed!')} />
</div>
