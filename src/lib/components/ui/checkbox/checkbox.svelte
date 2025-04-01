<script lang="ts">
	import { Checkbox as CheckboxPrimitive } from 'bits-ui';
	import Check from 'lucide-svelte/icons/check';
	import Minus from 'lucide-svelte/icons/minus';
	import { cn } from '$lib/utils.js';

	type $$Props = CheckboxPrimitive.Props & { size?: 'md' | 'sm' | 'lg' };
	type $$Events = CheckboxPrimitive.Events;

	let className: $$Props['class'] = undefined;
	export let checked: $$Props['checked'] = false;
	export let size: $$Props['size'] = 'md';
	export { className as class };

	let size1Class = 'h-4 w-4';
	let size2Class = 'h-3.5 w-3.5';
	$: {
		if (size === 'lg') {
			size1Class = 'h-6 w-6';
			size2Class = 'h-5.5 w-5.5';
		} else if (size === 'sm') {
			size1Class = 'h-3 w-3';
			size2Class = 'h-2.5 w-2.5';
		} else {
			size1Class = 'h-4 w-4';
			size2Class = 'h-3.5 w-3.5';
		}
	}
</script>

<CheckboxPrimitive.Root
	class={cn(
		'peer box-content h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[disabled=true]:cursor-not-allowed data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[disabled=true]:opacity-50',
		size1Class,
		className
	)}
	bind:checked
	{...$$restProps}
	on:click
>
	<CheckboxPrimitive.Indicator
		class={cn('flex items-center justify-center text-current', size1Class)}
		let:isChecked
		let:isIndeterminate
	>
		{#if isChecked}
			<Check class={size2Class} />
		{:else if isIndeterminate}
			<Minus class={size2Class} />
		{/if}
	</CheckboxPrimitive.Indicator>
</CheckboxPrimitive.Root>
