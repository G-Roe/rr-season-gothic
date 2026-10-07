---
tags: [how-to, deploy, cloudflare]
---

# How to deploy to Cloudflare Pages

Get changes from your machine onto the live site. Back to [[Home]].

## How it's set up

The Cloudflare Pages project `rr-season-gothic` is **Git-connected** to the GitHub repo `G-Roe/rr-season-gothic`. Cloudflare builds and deploys automatically whenever you push to `main`.

| Setting | Value |
| --- | --- |
| Live site | <https://rr-season-gothic.pages.dev> |
| Repo | `G-Roe/rr-season-gothic` |
| Production branch | `main` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Automatic deployments | Enabled |

There is nothing to run on your machine to deploy. No Wrangler, no login, no upload. Pushing is the deploy.

## Update the site

1. **Make your changes** and check them locally (see [[How to run locally]]):

   ```bash
   npm run dev
   ```

2. **Check the build and lint pass**, so Cloudflare's build won't fail:

   ```bash
   npm run lint
   npm run build
   ```

3. **Commit and push to `main`:**

   ```bash
   git add .
   git commit -m "Describe the change"
   git push
   ```

4. **Watch the deploy.** Cloudflare dashboard → **Workers & Pages** → `rr-season-gothic` → **Deployments**. The new commit appears at the top and shows a green tick when it succeeds (usually a minute or two).

5. **Check the live site** at the URL above. Hard-refresh (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>) in case your browser cached the old version.

> [!tip] Adding events or images
> Event markdown files and images are part of the repo, so they deploy the same way. See the project `README.md` for the event file format and where images go.

## Preview a change before it goes live

Pushes to any branch other than `main` get their own **preview URL** and don't touch the live site.

```bash
git switch -c my-change
git add .
git commit -m "Describe the change"
git push -u origin my-change
```

Find the preview URL under **Deployments** (the Environment column shows "Preview"). When you're happy, merge the branch into `main` (for example with a pull request on GitHub) to publish it.

## Roll back a bad deploy

Dashboard → **Deployments** → find an earlier good deployment → **⋯** menu → **Rollback to this deployment**. The site reverts immediately. Then fix the problem in the code and push again.

## Troubleshooting

- **Live site looks unchanged**: confirm the push reached GitHub, then check **Deployments** for a new entry. Hard-refresh the browser.
- **Deployment shows a red cross**: open **Details** and read the build log. Run `npm run build` locally to reproduce the error.
- **Build fails with a Node version error**: this project uses Vite 8, which needs Node 20.19+ or 22.12+. In the Cloudflare project, go to **Settings** → **Variables and Secrets** (or **Environment variables**) and set `NODE_VERSION` to `22`.
- **No new deployment after a push**: check you pushed to `main` (`git branch --show-current`) and that "Automatic deployments" is still enabled under **Settings**.
- **Repo shows "In use" when creating a new Pages project**: expected. The repo is already connected to this project, so you don't need a new one.

## Alternatives (not needed now)

These only matter if the setup ever changes:

- **Manual upload with Wrangler**: `npm run build`, then `npx wrangler pages deploy dist --project-name rr-season-gothic` (after a one-time `npx wrangler login`). Don't use this on a Git-connected project unless you have a reason. Deploys made this way aren't tied to a commit.
- **Cloudflare's newer route**: Cloudflare now promotes Workers with static assets over Pages ("legacy Pages workflow" in the dashboard). Pages still works. Moving later would need a `wrangler.jsonc` in the repo.

## Related

- [[How to run locally]]
- Project README: `README.md`, "Deploy to Cloudflare Pages"
