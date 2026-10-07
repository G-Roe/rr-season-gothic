---
tags: [how-to, events]
---

# How to add or remove an event

Events are markdown files in `src/events/`. The site finds them automatically, so there is no list to edit. Back to [[Home]].

## Add an event

1. Create a new file in `src/events/`, named `event-<number>-<short-name>.md`, e.g. `event-6-my-game.md`. The easiest way is to copy an existing event file.
2. Fill in the front matter (see the template in the project `README.md`):
   - `title`, `image`, `system`, `gm`, `duration`, `max_players`, `rating`
   - `gamecode`: a **unique** short code. This is what gets recorded in the sign-up sheet, so two events must never share one.
   - `start`: UK time, `YYYY-MM-DD HH:mm`. See [[How to set event times]].
   - `tech`: optional, shown after the GM.
3. Write the description below the closing `---`.
4. Put the image in `public/images/` and reference it as `/images/<file>`.
5. Check it locally (see [[How to run locally]]). Restart the dev server if the new file doesn't appear.
6. Commit and push to publish (see [[How to deploy to Cloudflare Pages]]).

## Remove an event

Delete its file from `src/events/`, then commit and push. (Or rename it so it doesn't end in `.md`.)

## Order on the page

- Files named `info-*.md` (such as the welcome card) always come first.
- Everything else follows in filename order. Numbers are compared as numbers, so `event-2` comes before `event-10`.
- To change where an event appears, change the number in its filename.

## Info cards

A file with `type: info` in its front matter is a text card, not a selectable event. The page heading uses the `title` of the first `info-*` card.

## Troubleshooting

- **New event doesn't appear**: check the file ends in `.md`, is directly inside `src/events/`, and starts with a `---` front matter block. Restart the dev server.
- **Two events look identical**: check you changed the `title` and `gamecode` after copying a file.
- **Wrong order**: rename the files so the numbers are in the order you want.

## Related

- [[How to set event times]]
- Project README: `README.md`
