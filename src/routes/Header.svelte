<script lang="ts">
	import LightSwitch from '$lib/components/ui/LightSwitch.svelte';
	import Wrapper from '$lib/components/ui/Wrapper.svelte';
	import { page } from '$app/state';
	import { SignOut } from '@auth/sveltekit/components';
</script>

<header>
	<Wrapper class="my-2 flex items-center justify-between bg-background/60 md:px-2">
		<a href="/" class="flex items-center">
			<img src="/Logo-Light.png" class="dark:hidden" height="92px" alt="Keep It Up" />
			<img src="/Logo-Dark.png" class="hidden dark:block" height="92px" alt="Keep It Up" />
		</a>

		<div class="flex items-center gap-6 py-4 pr-2 md:pr-6">
			<LightSwitch />
			<nav class="flex items-center gap-3">
				{#if page.data.session}
					<a href="/user/tasks">Tasks</a>
					<SignOut>
						<span>Sign Out</span>
					</SignOut>
				{:else}
					<a href={`/signin`}>Sign In</a>
					<a href="/about">About</a>
				{/if}
			</nav>
		</div>
	</Wrapper>
</header>
