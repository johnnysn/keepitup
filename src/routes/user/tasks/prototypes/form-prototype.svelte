<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { prototypeFormSchema, type PrototypeFormSchema } from '$lib/schemas/prototype-schema';
	import { toast } from 'svelte-sonner';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Label } from '$lib/components/ui/label';
	import { formatWeekDay } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';

	type Props = {
		data: SuperValidated<Infer<PrototypeFormSchema>>;
	};

	let { data }: Props = $props();
	let checks = $state([false, false, false, false, false, false, false]);

	const form = superForm(data, {
		validators: zodClient(prototypeFormSchema),
		onError({ result }) {
			toast.error(result.error.message);
		},
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Prototype successfully created!');
			} else {
				toast.error('There has been an error when creating a new prototype');
				console.log(form.errors);
			}
			checks = [false, false, false, false, false, false, false];
		}
	});

	const { form: formData, enhance } = form;

	function checkedChanged(pos: number, value: boolean): void {
		formData.update((current) => {
			let wd = formatWeekDay(current.weekDays, pos, value);
			// console.log(wd);

			return { ...current, weekDays: wd };
		});
	}

	function setWeekdays() {
		formData.update((current) => {
			let wd = '0000000';
			if (current.weekDays && current.weekDays.length === 7) wd = current.weekDays;

			return {
				...current,
				weekDays: wd.charAt(0) + '11111' + wd.charAt(6)
			};
		});
		checks = [checks[0], true, true, true, true, true, checks[6]];
	}

	function setWeekends() {
		formData.update((current) => {
			let wd = '0000000';
			if (current.weekDays && current.weekDays.length === 7) wd = current.weekDays;

			return { ...current, weekDays: '1' + wd.slice(1, 6) + '1' };
		});
		checks[0] = true;
		checks[6] = true;
	}

	function setEveryday() {
		formData.update((current) => {
			return { ...current, weekDays: '1111111' };
		});
		checks = [true, true, true, true, true, true, true];
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

	<div class="mb-4 flex items-center gap-4">
		<Button variant="secondary" size="sm" type="button" onclick={() => setWeekdays()}>
			Weekdays
		</Button>
		<Button variant="secondary" size="sm" type="button" onclick={() => setWeekends()}>
			Weekends
		</Button>
		<Button variant="secondary" size="sm" type="button" onclick={() => setEveryday()}>
			Everyday
		</Button>
	</div>

	<div class="mb-4 flex flex-wrap space-x-6">
		<div class="mb-2 flex items-center gap-2 space-y-0">
			<Checkbox
				id="chk_mon"
				onCheckedChange={(checked) => checkedChanged(1, !!checked)}
				bind:checked={checks[1]}
			/>
			<div class="space-y-1 leading-none">
				<Label for="chk_mon">Monday</Label>
			</div>
		</div>

		<div class="mb-2 flex items-center gap-2 space-y-0">
			<Checkbox
				id="chk_tue"
				onCheckedChange={(checked) => checkedChanged(2, !!checked)}
				bind:checked={checks[2]}
			/>
			<div class="space-y-1 leading-none">
				<Label for="chk_tue">Tuesday</Label>
			</div>
		</div>

		<div class="mb-2 flex items-center gap-2 space-y-0">
			<Checkbox
				id="chk_wed"
				onCheckedChange={(checked) => checkedChanged(3, !!checked)}
				bind:checked={checks[3]}
			/>
			<div class="space-y-1 leading-none">
				<Label for="chk_wed">Wednesday</Label>
			</div>
		</div>

		<div class="mb-2 flex items-center gap-2 space-y-0">
			<Checkbox
				id="chk_thu"
				onCheckedChange={(checked) => checkedChanged(4, !!checked)}
				bind:checked={checks[4]}
			/>
			<div class="space-y-1 leading-none">
				<Label for="chk_thu">Thursday</Label>
			</div>
		</div>

		<div class="mb-2 flex items-center gap-2 space-y-0">
			<Checkbox
				id="chk_fri"
				onCheckedChange={(checked) => checkedChanged(5, !!checked)}
				bind:checked={checks[5]}
			/>
			<div class="space-y-1 leading-none">
				<Label for="chk_fri">Friday</Label>
			</div>
		</div>
	</div>

	<div class="flex flex-wrap gap-6">
		<div class="mb-2 flex items-center gap-2 space-y-0">
			<Checkbox
				id="chk_sat"
				onCheckedChange={(checked) => checkedChanged(6, !!checked)}
				bind:checked={checks[6]}
			/>
			<div class="space-y-1 leading-none">
				<Label for="chk_sat">Saturday</Label>
			</div>
		</div>

		<div class="mb-2 flex items-center gap-2 space-y-0">
			<Checkbox
				id="chk_sun"
				onCheckedChange={(checked) => checkedChanged(0, !!checked)}
				bind:checked={checks[0]}
			/>
			<div class="space-y-1 leading-none">
				<Label for="chk_sun">Sunday</Label>
			</div>
		</div>
	</div>

	<Form.Button class="mt-4 w-full">Create recurrent task</Form.Button>
</form>
