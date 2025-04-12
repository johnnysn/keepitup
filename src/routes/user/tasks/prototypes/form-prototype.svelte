<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { prototypeFormSchema, type PrototypeFormSchema } from '$lib/schemas/prototype-schema';
	import { toast } from 'svelte-sonner';
	import SuperDebug, { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { browser } from '$app/environment';
	import { Control } from 'formsnap';
	import { Label } from '$lib/components/ui/label';

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

	const { form: formData, enhance } = form;

	function checkedChanged(pos: number, value: boolean): void {
		formData.update((current) => {
			let wd = '0000000';
			if (current.weekDays && current.weekDays.length === 7) wd = current.weekDays;

			wd = wd.slice(0, pos) + (value ? '1' : '0') + wd.slice(pos + 1);

			return { ...current, weekDays: wd };
		});
	}
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

	<Form.Field {form} name="weekDays">
		<Form.Control let:attrs>
			<Input {...attrs} type="hidden" bind:value={$formData.weekDays} />
		</Form.Control>
	</Form.Field>

	<div class="mb-4 flex flex-wrap space-x-6">
		<div class="mb-2 flex items-center gap-2 space-y-0">
			<Checkbox id="chk_mon" onCheckedChange={(checked) => checkedChanged(1, !!checked)} />
			<div class="space-y-1 leading-none">
				<Label for="chk_mon">Monday</Label>
			</div>
		</div>

		<div class="mb-2 flex items-center gap-2 space-y-0">
			<Checkbox id="chk_tue" onCheckedChange={(checked) => checkedChanged(2, !!checked)} />
			<div class="space-y-1 leading-none">
				<Label for="chk_tue">Tuesday</Label>
			</div>
		</div>

		<div class="mb-2 flex items-center gap-2 space-y-0">
			<Checkbox id="chk_wed" onCheckedChange={(checked) => checkedChanged(3, !!checked)} />
			<div class="space-y-1 leading-none">
				<Label for="chk_wed">Wednesday</Label>
			</div>
		</div>

		<div class="mb-2 flex items-center gap-2 space-y-0">
			<Checkbox id="chk_thu" onCheckedChange={(checked) => checkedChanged(4, !!checked)} />
			<div class="space-y-1 leading-none">
				<Label for="chk_thu">Thursday</Label>
			</div>
		</div>

		<div class="mb-2 flex items-center gap-2 space-y-0">
			<Checkbox id="chk_fri" onCheckedChange={(checked) => checkedChanged(5, !!checked)} />
			<div class="space-y-1 leading-none">
				<Label for="chk_fri">Friday</Label>
			</div>
		</div>
	</div>

	<div class="flex flex-wrap gap-6">
		<div class="mb-2 flex items-center gap-2 space-y-0">
			<Checkbox id="chk_sat" onCheckedChange={(checked) => checkedChanged(7, !!checked)} />
			<div class="space-y-1 leading-none">
				<Label for="chk_sat">Saturday</Label>
			</div>
		</div>

		<div class="mb-2 flex items-center gap-2 space-y-0">
			<Checkbox id="chk_sun" onCheckedChange={(checked) => checkedChanged(0, !!checked)} />
			<div class="space-y-1 leading-none">
				<Label for="chk_sun">Sunday</Label>
			</div>
		</div>
	</div>

	<Form.Button class="mt-4 w-full">Create recurrent task</Form.Button>

	{#if browser}
		<SuperDebug data={$formData} />
	{/if}
</form>
