# TTRPG Event Picker

A single-page app for prioritising one-shot TTRPG events at a convention.

## Adding / editing events

Edit or add markdown files in `src/events/`. Every `.md` file in that folder is picked up automatically (no code changes needed). Files named `info-*.md` are shown first, then the rest in filename order (`event-2` before `event-10`), so use a numbered name like `event-6-my-game.md` to control where an event appears. Each event needs a unique `gamecode`, because that is what is recorded in the sign-up sheet.

Each markdown file follows this template:

```md
---
title: The Hunted
image: /images/the-hunted.jpg
system: The Hunted
system_url: https://www.drivethrurpg.com/product/the-hunted
gm: IdesOfMarch (Alex)
tech: Discord voice, Foundry VTT
start: 2025-04-28 19:30
duration: 3.5 hour session
max_players: 4
rating: 18
---

Description paragraph one.

Description paragraph two.
```

### Optional field: tech

`tech` (e.g. platform or software needed) is optional. It is shown on the same line as the GM, after it, and is left out when the field is missing. The value must stay on one line.

### Event times

`start` is written in **UK local time** as `YYYY-MM-DD HH:mm` (24-hour). Never convert for GMT/BST yourself: the site works that out from the date. It displays the time as UK time (e.g. `19:30 BST`). Visitors in a different time zone get a tooltip on the time showing it in their own zone. Events with no `start` fall back to a plain `time:` text field and get no tooltip.

## Adding images

Drop image files into `public/images/`. Reference them in the markdown frontmatter as `/images/filename.jpg`.

## Local development

```bash
npm install
npm run dev
```

## Deploy to Cloudflare Pages

1. Push this repo to GitHub
2. In Cloudflare Pages, connect the repo
3. Build command: `npm run build`
4. Output directory: `dist`
5. Done — Cloudflare will build and deploy automatically on every push
