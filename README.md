# Keep It Up 🛡️

**Keep It Up** is a lightweight and distraction-free task manager designed with simplicity at its core — ideal for anyone looking to stay organized, especially those with ADHD.

It supports recurring tasks (e.g. "Every Monday and Thursday"), daily checklists, and offers a clean, minimal interface that helps you focus on _what matters for today_.

Built with [`sv`](https://github.com/sveltejs/cli), it runs fast and is easy to extend.

---

## ✨ Why Keep It Up?

- ✅ **Built for simplicity** – no clutter, no noise, just your tasks.
- ♻️ **Recurring tasks** – set routines for specific days of the week.
- 🧠 **ADHD-friendly** – intentionally minimal and structured to reduce overwhelm.

---

## 🚀 Developing

After installing dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm run dev
# or
pnpm run dev -- --open
```

Spin up a local database for development:

```bash
docker compose -f compose-dev.yml up -d
```

Check database logs:

```bash
docker compose -f compose-dev.yml logs -f postgres
```

---

## 🏗️ Building

To generate a production-ready version:

```bash
pnpm run build
```

Preview the production build locally:

```bash
pnpm run preview
```

> 📦 To deploy your app, consider using an appropriate [adapter](https://svelte.dev/docs/kit/adapters) for your target platform.

---

Made with care — for focused days and brighter routines ✨
