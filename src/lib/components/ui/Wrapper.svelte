<script>
	import { cn } from '$lib/utils';

	let clazz = '';
	export { clazz as class };
</script>

<div class="w-full">
	<div class={cn(`mx-auto w-full max-w-screen-lg`, clazz)}>
		<slot />
	</div>
</div>
