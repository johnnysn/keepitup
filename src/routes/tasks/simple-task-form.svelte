<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { simpleTaskSchema, type SimpleTaskSchema } from '$lib/schemas/task-schema';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	type Props = {
		data: SuperValidated<Infer<SimpleTaskSchema>>;
	};

	let { data }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(simpleTaskSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" class="max-w-screen-sm" action="?/create" use:enhance>
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>New task</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.Description>Input a simple and descriptive name</Form.Description>
		<div class="flex min-h-4 flex-row">
			<span></span>
			<Form.FieldErrors />
		</div>
	</Form.Field>
	<Form.Button class="w-full">Create new task</Form.Button>
</form>
