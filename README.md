# TTRPG Event Picker

A single-page app for prioritising one-shot TTRPG events at a convention.

## Adding / editing events

Edit or add markdown files in `src/events/`. Then update `src/events/index.js` to import the new file and add it to the `raws` array.

Each markdown file follows this template:

```md
---
title: The Hunted
image: /images/the-hunted.jpg
system: The Hunted
system_url: https://www.drivethrurpg.com/product/the-hunted
gm: IdesOfMarch (Alex)
time: Monday, 28 April. 19:30
duration: 3.5 hour session
max_players: 4
rating: 18
---

Description paragraph one.

Description paragraph two.
```

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
