<script lang="ts">
	import LightSwitch from '$lib/components/ui/LightSwitch.svelte';
	import Wrapper from '$lib/components/ui/Wrapper.svelte';
	import { page } from '$app/state';
	import { SignOut } from '@auth/sveltekit/components';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<header>
	<Wrapper class="my-2 flex items-center justify-between bg-background/60">
		<a href="/" class="flex items-center">
			<img src="/logo-mini.png" height="94px" alt="Keepup logo" />
			<span class="ml-4 text-lg">Keep <br />ItUp</span>
		</a>

		<div class="flex items-center gap-6 py-4 pr-2 md:pr-6">
			<LightSwitch />
			<nav class="flex items-center gap-3">
				{#if page.data.session}
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
