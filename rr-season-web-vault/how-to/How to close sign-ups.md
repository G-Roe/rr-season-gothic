---
tags: [how-to, signups, config]
---

# How to close sign-ups

Close (or reopen) player sign-ups while keeping the site up. Back to [[Home]].

## How it works

One switch controls it: `SIGNUPS_OPEN` in `src/config.js`.

```js
export const SIGNUPS_OPEN = true   // true = open, false = closed
```

| Setting | What visitors see |
| --- | --- |
| `true` | The normal form: Discord username box and Submit button. |
| `false` | The form is replaced by a clickable line, **"The season is now closed for players"**. Clicking it plays the thunder and lightning. |

When closed, the rest of the site stays as it is: events, descriptions and the "Your Picks" list.

## Close sign-ups

1. Open `src/config.js` and change the line to:

   ```js
   export const SIGNUPS_OPEN = false
   ```

2. Deploy it. Either double-click `deploy.bat`, or commit and push to `main` (see [[How to deploy to Cloudflare Pages]]).

3. Wait for the Cloudflare build to finish (usually 1-3 minutes), then check the live site. Hard-refresh (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>) in case your browser cached the old version.

## Reopen sign-ups

Change it back to `export const SIGNUPS_OPEN = true`, then deploy the same way.

## Preview the closed message locally

1. Set `SIGNUPS_OPEN = false` and run `npm run dev` (see [[How to run locally]]).
2. Scroll to the bottom of the page and click the closed message to try the storm.
3. **Set it back to `true` before deploying**, unless you mean to close sign-ups.

## Things to know

> [!warning] This only hides the form
> Closing sign-ups removes the form from the page. The Google Apps Script address in `src/config.js` still accepts anything posted straight to it, so someone who sent data directly could still add a row. To refuse entries for real, add a check to the Apps Script that rejects new rows when sign-ups are closed.

- The numbered priority buttons on each event still work when closed. They just have no Submit button to go with them.
- The storm test button (shown in dev mode, or on the live site with `?test` on the end of the URL) only appears while sign-ups are open, since it sits next to Submit. When closed, click the closed message instead.
- Nothing takes effect until the deploy finishes. If the live site looks unchanged, see the troubleshooting section in [[How to deploy to Cloudflare Pages]].

## Related

- [[How to deploy to Cloudflare Pages]]
- [[How to run locally]]
- Project README: `README.md`, "Opening and closing sign-ups"
