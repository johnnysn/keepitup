<script lang="ts">
	import TaskForm from './task-form.svelte';

	let { data } = $props();
</script>

<h1 class="mb-4 text-2xl font-semibold">Edit task</h1>

<TaskForm data={data.form} />
