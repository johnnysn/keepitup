<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Input } from '$lib/components/ui/input';
	import { formTaskSchema, type FormTaskSchema } from '$lib/schemas/task-schema';
	import { toast } from 'svelte-sonner';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils';

	type Props = {
		data: SuperValidated<Infer<FormTaskSchema>>;
	};

	let { data }: Props = $props();

	const form = superForm(data, {
		validators: zodClient(formTaskSchema),
		onError({ result }) {
			toast.error(result.error.message);
		},
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Task updated!');
			}
		},
		resetForm: false
	});

	const { form: formData, enhance } = form;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let value = $state<DateValue | undefined>();

	formData.subscribe((data) => {
		value = data.date ? parseDate(data.date) : undefined;
	});

	let placeholder = $state<DateValue>(today(getLocalTimeZone()));
</script>

<form method="POST" class="w-full max-w-screen-sm" action="?/update" use:enhance>
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Task name</Form.Label>
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
			<Form.Label>Task description</Form.Label>
			<Input {...attrs} bind:value={$formData.description} />
		</Form.Control>
		<Form.Description>Short description about the task</Form.Description>
		<div class="flex min-h-4 flex-row">
			<span></span>
			<Form.FieldErrors />
		</div>
	</Form.Field>

	<Form.Field {form} name="date" class="flex flex-col">
		<Form.Control let:attrs>
			<Form.Label>Date</Form.Label>
			<Popover.Root>
				<Popover.Trigger
					{...attrs}
					class={cn(
						buttonVariants({ variant: 'outline' }),
						'w-[280px] justify-start pl-4 text-left font-normal',
						!value && 'text-muted-foreground'
					)}
				>
					{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
					<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
				</Popover.Trigger>
				<Popover.Content class="w-auto p-0" side="top">
					<Calendar
						{value}
						bind:placeholder
						minValue={new CalendarDate(1900, 1, 1)}
						calendarLabel="Date"
						initialFocus
						onValueChange={(v) => {
							if (v) {
								$formData.date = v.toString();
							} else {
								$formData.date = '';
							}
						}}
					/>
				</Popover.Content>
			</Popover.Root>
			<Form.Description>Select the date of the task</Form.Description>
			<Form.FieldErrors />
			<input hidden value={$formData.date} name={attrs.name} />
		</Form.Control>
	</Form.Field>

	<Form.Button class="w-full">Update task</Form.Button>
</form>
