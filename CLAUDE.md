# CLAUDE.md — Project briefing for Claude Code

## What this is
The personal website for **Kareem Hilaly**, served at **kar-tel.app**.
It is a single static HTML site. No framework, no build step. Keep it that way unless explicitly asked to change.

## Structure
- `public/index.html` — the entire website. This is the only file you normally edit.
- `wrangler.jsonc` — Cloudflare config. `assets.directory` points at `./public`, which is what gets served.
- `.gitignore` — keeps `node_modules/` and `.wrangler/` out of git.

## Hosting
- Domain `kar-tel.app` is registered and DNS-managed at **Cloudflare**.
- The site is hosted on **Cloudflare** (Workers static assets), connected to the GitHub repo
  `Egyptian-Magician/Kareem-s-Telecommunications-website` via Cloudflare's Git integration (Workers Builds).

## How to deploy (the normal way — automatic)
Cloudflare auto-deploys on every push to the `main` branch. So to ship a change:

```bash
git add -A
git commit -m "describe the change"
git push origin main
```

Cloudflare rebuilds and the new version is live at kar-tel.app in about a minute. **No dashboard needed.**

## How to deploy manually (only if Git auto-deploy is unavailable)
Requires a one-time `npx wrangler login` (opens a browser to authorize — the user does this themselves):

```bash
npx wrangler deploy
```

This pushes the contents of `./public` straight to Cloudflare.

## Conventions
- Edit content directly in `public/index.html`. Sections are marked with HTML comments (HERO, ABOUT, WHAT I DO, CONTACT).
- Do not add a framework, bundler, or build step without being asked.
- Do not commit secrets, API tokens, or `node_modules/`.
- If asked to set `name` in `wrangler.jsonc`, it must match the Cloudflare Worker/project name exactly.

## The custom domain
If kar-tel.app is not yet attached to this project, it is done once in the Cloudflare dashboard
(project → Custom domains / Domains & Routes → add `kar-tel.app`). After that it never needs touching again.
