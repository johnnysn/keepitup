<script lang="ts">
	import FormPrototype from './form-prototype.svelte';
	import PrototypeList from './prototype-list.svelte';

	let { data } = $props();

	function updatedOrder(items: string[]): void {
		throw new Error('Function not implemented.');
	}
</script>

<FormPrototype data={data.form} />

<PrototypeList items={data.protos} onUpdatedOrder={updatedOrder} />
