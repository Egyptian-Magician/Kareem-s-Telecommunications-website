# CLAUDE.md — Kar-Tel website (kar-tel.app)

## What this is
The business website for **Kimo (Kareem Hilaly)** — independent repair tech and
IT consultant in San Diego. Static site, no framework, no build step.
**Claude Code IS the CMS**: content updates happen by editing these files and
pushing; Cloudflare auto-deploys from the main branch.

## Structure
- `public/index.html` — main site. Sections marked with `EDIT` comments:
  HERO, REPAIRS, SERVICES, PRODUCTS, ABOUT, CONTACT.
- `public/angelina/index.html` — Angelina AI receptionist coming-soon page.
- `public/sitemap.xml` — update `lastmod` whenever a page meaningfully changes.
  Add a `<url>` entry whenever a new page is created.
- `public/robots.txt` — leave permissive.
- `public/_headers` — security headers served by Cloudflare.
- `wrangler.jsonc` — serves `./public`. `name` must match the Cloudflare project.

## How to deploy
Push to main = live in ~1 minute:
```bash
git add -A && git commit -m "describe change" && git push origin main
```
Manual fallback (needs one-time `npx wrangler login` by the user): `npx wrangler deploy`

## Content conventions (the "CMS rules")
- Common requests map to sections: "change prices/repairs" → REPAIRS cards;
  "add a service" → SERVICES cards (copy an existing `.card`); "launch Angelina"
  → PRODUCTS badge from "Coming soon" to "Live" + update /angelina/ page;
  "change contact info" → CONTACT channels.
- Keep the voice: direct, no agency-speak, "one tech, direct line" positioning.
- Design tokens live in `:root` on each page (copper #D98E4A on slate night
  #10151D, Unbounded display / Archivo body / IBM Plex Mono utility). Reuse
  them; don't introduce new colors or fonts without being asked.
- New pages: create `public/<slug>/index.html`, copy the head pattern
  (title, meta description, canonical, OG tags), add to sitemap.xml.

## SEO checklist (run on EVERY content change)
1. `<title>` ≤ 60 chars, includes the page's primary keyword + "San Diego"
   where relevant.
2. `<meta name="description">` ≤ 155 chars, rewritten if the page's purpose changed.
3. Canonical URL correct for the page.
4. One `<h1>` per page; headings nest in order (h1 → h2 → h3).
5. JSON-LD on index.html: keep LocalBusiness fields in sync with visible
   content (services, email). If a phone number is added to the site, add
   `"telephone"` to the JSON-LD too.
6. sitemap.xml `lastmod` bumped for changed pages.
7. No render-blocking additions; keep the site static and fast.

## SEO monitoring loop (how "adapting to Google" actually works)
- Site is registered in **Google Search Console** (user does this once at
  https://search.google.com/search-console — verify via DNS TXT on Cloudflare).
- Periodically the user exports Search Console performance data (queries,
  clicks, impressions, position) and hands it to Claude Code.
- Claude Code's job: identify pages/queries that lost position, propose
  content/structure fixes, implement, push, and re-check next export.
- Do not promise algorithm-change detection; there is no API for it. Ranking
  shifts in Search Console data ARE the signal.

## Email + phone
- Business phone **(858) 389-8698** appears in the hero, the contact section,
  and the JSON-LD `telephone` field. Keep all three in sync if it changes.
- `admin@kar-tel.app` works via **Cloudflare Email Routing** (free): Cloudflare
  dashboard → the kar-tel.app zone → Email → Email Routing → create address
  `admin@` → forward to the user's Gmail. Cloudflare adds the MX records itself.
- Sending FROM admin@kar-tel.app happens in Gmail: Settings → Accounts →
  "Send mail as" (user-driven; needs an app password or SMTP config).
- If deliverability work is ever done for this domain: SPF/DKIM/DMARC records
  are managed in the Cloudflare DNS tab. The user is a deliverability
  consultant — defer to their record preferences.

## Roadmap (agreed direction — don't build unprompted, but don't fight it)
- Contact form with a Cloudflare Worker/Pages Function handler (replaces mailto).
- Angelina dashboard: a Vite/React app will eventually live in this project or
  a sibling; static site stays the marketing front.
- If the site grows past ~6 pages or adds a blog: migrate to Astro + keep
  file-based content so Claude Code remains the CMS. Sveltia CMS optional later.

## Hard rules
- Never commit secrets or tokens.
- Never remove the JSON-LD, sitemap, robots.txt, or canonical tags.
- Keep everything deployable as static assets from `./public`.
