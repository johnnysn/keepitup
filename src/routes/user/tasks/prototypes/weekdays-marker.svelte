<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	type Props = {
		weekDays: string;
		onCheckChanged: (day: number, value: boolean) => void;
	};

	let { weekDays, onCheckChanged }: Props = $props();
</script>

<div class="my-1.5 flex flex-col gap-1.5">
	<div class="flex gap-3">
		<div class="flex items-center gap-1">
			<Checkbox
				size="sm"
				id="chk_mk_mon"
				checked={weekDays[1] === '1'}
				onCheckedChange={(chk) => onCheckChanged(1, !!chk)}
			/>
			<Label for="chk_mk_mon" class="text-sm">Mon</Label>
		</div>

		<div class="flex items-center gap-1">
			<Checkbox
				size="sm"
				id="chk_mk_tue"
				checked={weekDays[2] === '1'}
				onCheckedChange={(chk) => onCheckChanged(2, !!chk)}
			/>
			<Label for="chk_mk_tue" class="text-sm">Tue</Label>
		</div>

		<div class="flex items-center gap-1">
			<Checkbox
				size="sm"
				id="chk_mk_wed"
				checked={weekDays[3] === '1'}
				onCheckedChange={(chk) => onCheckChanged(3, !!chk)}
			/>
			<Label for="chk_mk_wed" class="text-sm">Wed</Label>
		</div>

		<div class="flex items-center gap-1">
			<Checkbox
				size="sm"
				id="chk_mk_thu"
				checked={weekDays[4] === '1'}
				onCheckedChange={(chk) => onCheckChanged(4, !!chk)}
			/>
			<Label for="chk_mk_thu" class="text-sm">Thu</Label>
		</div>

		<div class="flex items-center gap-1">
			<Checkbox
				size="sm"
				id="chk_mk_fri"
				checked={weekDays[5] === '1'}
				onCheckedChange={(chk) => onCheckChanged(5, !!chk)}
			/>
			<Label for="chk_mk_fri" class="text-sm">Fri</Label>
		</div>
	</div>
	<div class="flex gap-3">
		<div class="flex items-center gap-1">
			<Checkbox
				size="sm"
				id="chk_mk_sat"
				checked={weekDays[6] === '1'}
				onCheckedChange={(chk) => onCheckChanged(6, !!chk)}
			/>
			<Label for="chk_mk_sat" class="text-sm">Sat</Label>
		</div>

		<div class="flex items-center gap-1">
			<Checkbox
				size="sm"
				id="chk_mk_sun"
				checked={weekDays[0] === '1'}
				onCheckedChange={(chk) => onCheckChanged(0, !!chk)}
			/>
			<Label for="chk_mk_sun" class="text-sm">Sun</Label>
		</div>
	</div>
</div>
