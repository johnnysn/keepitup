<script>
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { signIn } from '@auth/sveltekit/client';
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
		{:else}
			<!-- <a class={buttonVariants({ variant: 'default' })} href="/auth/signin">Sign In</a> -->
			<Button on:click={() => signIn('github', { redirectTo: '/user' })}>Sign In with GitHub</Button
			>
		{/if}
	</div>
</div>
