<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { simpleTaskSchema, type SimpleTaskSchema } from '$lib/schemas/task-schema';
	import { toast } from 'svelte-sonner';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	type Props = {
		data: SuperValidated<Infer<SimpleTaskSchema>>;
	};

	let { data }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(simpleTaskSchema),
		onError({ result }) {
			toast.error(result.error.message);
		},
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Task successfully created!');
			}
		}
	});

	const { form: formData, enhance, message } = form;
</script>

<form method="POST" class="w-full max-w-screen-sm" action="?/create" use:enhance>
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
