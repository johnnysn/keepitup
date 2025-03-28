<script>
	import { SignIn, SignOut } from '@auth/sveltekit/components';
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="flex flex-col items-center">
	<h1 class="mb-8 text-2xl font-bold">Authorization</h1>
	<div class="flex flex-col gap-2">
		{#if page.data.session}
			{#if page.data.session.user?.image}
				<!-- <img src={$page.data.session.user.image} class="avatar" alt="User Avatar" /> -->
			{/if}
			<span class="mb-4">
				<small>Signed in as</small><br />
				<strong>{page.data.session.user?.name ?? 'User'}</strong>
			</span>
			<SignOut>
				<Button slot="submitButton">Sign Out</Button>
			</SignOut>
		{:else}
			<SignIn>
				<Button slot="submitButton">Sign In</Button>
			</SignIn>
		{/if}
	</div>
</div>
