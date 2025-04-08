<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { prototypeFormSchema, type PrototypeFormSchema } from '$lib/schemas/prototype-schema';
	import { toast } from 'svelte-sonner';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	type Props = {
		data: SuperValidated<Infer<PrototypeFormSchema>>;
	};

	let { data }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(prototypeFormSchema),
		onError({ result }) {
			toast.error(result.error.message);
		},
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Prototype successfully created!');
			}
		}
	});

	const { form: formData, enhance, message } = form;
</script>

<form method="POST" class="w-full max-w-screen-sm" action="?/create" use:enhance>
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Recurrent task name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.Description>Input a simple and descriptive name</Form.Description>
		<div class="flex min-h-4 flex-row">
			<span></span>
			<Form.FieldErrors />
		</div>
	</Form.Field>

	<Form.Field {form} name="description">
		<Form.Control let:attrs>
			<Form.Label>Recurrent task description</Form.Label>
			<Input {...attrs} bind:value={$formData.description} />
		</Form.Control>
		<Form.Description>Short description for recurrent task</Form.Description>
		<div class="flex min-h-4 flex-row">
			<span></span>
			<Form.FieldErrors />
		</div>
	</Form.Field>

	<div class="mb-4 flex flex-wrap space-x-6">
		<Form.Field {form} name="monday" class="mb-2 flex items-center gap-2 space-y-0">
			<Form.Control>
				{#snippet children({ props })}
					<Checkbox {...props} bind:checked={$formData.monday} />
					<div class="space-y-1 leading-none">
						<Form.Label>Monday</Form.Label>
					</div>
				{/snippet}
			</Form.Control>
		</Form.Field>
		<Form.Field {form} name="tuesday" class="mb-2 flex items-center gap-2 space-y-0">
			<Form.Control>
				{#snippet children({ props })}
					<Checkbox {...props} bind:checked={$formData.tuesday} />
					<div class="space-y-1 leading-none">
						<Form.Label>Tuesday</Form.Label>
					</div>
				{/snippet}
			</Form.Control>
		</Form.Field>
		<Form.Field {form} name="wednesday" class="mb-2 flex items-center gap-2 space-y-0">
			<Form.Control>
				{#snippet children({ props })}
					<Checkbox {...props} bind:checked={$formData.wednesday} />
					<div class="space-y-1 leading-none">
						<Form.Label>Wednesday</Form.Label>
					</div>
				{/snippet}
			</Form.Control>
		</Form.Field>
		<Form.Field {form} name="thursday" class="mb-2 flex items-center gap-2 space-y-0">
			<Form.Control>
				{#snippet children({ props })}
					<Checkbox {...props} bind:checked={$formData.thursday} />
					<div class="space-y-1 leading-none">
						<Form.Label>Thursday</Form.Label>
					</div>
				{/snippet}
			</Form.Control>
		</Form.Field>
		<Form.Field {form} name="friday" class="mb-2 flex items-center gap-2 space-y-0">
			<Form.Control>
				{#snippet children({ props })}
					<Checkbox {...props} bind:checked={$formData.friday} />
					<div class="space-y-1 leading-none">
						<Form.Label>Friday</Form.Label>
					</div>
				{/snippet}
			</Form.Control>
		</Form.Field>
	</div>

	<div class="flex flex-wrap gap-6">
		<Form.Field
			{form}
			name="saturday"
			class="flex flex-row items-start space-x-2 space-y-0 rounded-md"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Checkbox {...props} bind:checked={$formData.saturday} />
					<div class="space-y-1 leading-none">
						<Form.Label>Saturday</Form.Label>
					</div>
				{/snippet}
			</Form.Control>
		</Form.Field>
		<Form.Field
			{form}
			name="sunday"
			class="flex flex-row items-start space-x-2 space-y-0 rounded-md"
		>
			<Form.Control>
				{#snippet children({ props })}
					<Checkbox {...props} bind:checked={$formData.sunday} />
					<div class="space-y-1 leading-none">
						<Form.Label>Sunday</Form.Label>
					</div>
				{/snippet}
			</Form.Control>
		</Form.Field>
	</div>

	<Form.Button class="mt-4 w-full">Create recurrent task</Form.Button>
</form>
