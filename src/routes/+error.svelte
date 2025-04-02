<script lang="ts">
	import { page } from '$app/state';
</script>

<h1 class="mb-4 text-xl">There has been an error 🤤...</h1>

<p class="text-destructive">{page.error?.message}</p>
