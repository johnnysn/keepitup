<script lang="ts">
	import Wrapper from '$lib/components/ui/Wrapper.svelte';
	import { cn } from '$lib/utils';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import Header from './Header.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<title>Keep It Up</title>
</svelte:head>

<ModeWatcher />

<div class="bg-grid dark:bg-crow flex min-h-screen flex-col">
	<Header />

	<main class={cn('flex-1')}>
		<Wrapper class="px-2 py-2 md:px-6">
			{@render children()}
		</Wrapper>
	</main>

	<footer>
		<Wrapper class="flex flex-col py-4">
			<div class="text-center">Copyright &copy;2025</div>
		</Wrapper>
	</footer>
</div>
