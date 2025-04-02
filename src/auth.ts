import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/sveltekit/providers/github';
import { AUTH_GITHUB_ID, AUTH_GITHUB_SECRET, AUTH_SECRET } from '$env/static/private';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '$lib/server/prisma';

export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => {
	const authOptions = {
		adapter: PrismaAdapter(prisma),
		providers: [
			GitHub({
				clientId: AUTH_GITHUB_ID,
				clientSecret: AUTH_GITHUB_SECRET
			})
		],
		secret: AUTH_SECRET,
		trustHost: true
	};
	return authOptions;
});
