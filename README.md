# Keep It Up

Simple task managing application, powered by [`sv`](https://github.com/sveltejs/cli).

## Developing

Once you've installed dependencies with `pnpm install`, start a development server:

```bash
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

To start a local development database, run:

```bash
docker compose -f compose-dev.yml up -d
```

You can check the logs of the database by running:

```bash
docker compose -f compose-dev.yml logs -f postgres
```

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
