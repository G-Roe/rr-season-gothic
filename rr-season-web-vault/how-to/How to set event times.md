---
tags: [how-to, events, time]
---

# How to set event times

How event dates and times work on the site, including time zones. Back to [[Home]].

## The rule

Write every event time in **UK local time**, using the `start` field in the event's markdown front matter (`src/events/*.md`):

```md
start: 2025-04-28 19:30
```

- Format: `YYYY-MM-DD HH:mm`, 24-hour clock, with a space between date and time.
- **Do not convert for GMT/BST yourself.** Write the clock time people in the UK would see. The site works out whether that date is GMT or BST.
- Include the **year**, since the site needs it to work out daylight saving.

## What visitors see

| Visitor is in | They see |
| --- | --- |
| UK or anywhere on the same clock time at that moment (e.g. Dublin, Lisbon) | `Monday, 28 April. 19:30 BST`, with no tooltip |
| Any other time zone | The same UK time, with a dotted underline. Hovering, focusing or tapping it shows: *"You appear to be in America/New York, this will be Monday, 28 April. 14:30 EDT in your timezone."* |

The visitor's time zone comes from their browser or device settings. If their device clock or zone is set wrongly, the tooltip will be wrong, which is outside the site's control.

The time is shown on each event card and in the "Your Picks" summary.

## Steps to add or change a time

1. Open the event file in `src/events/`.
2. Edit the `start:` line. Use the format above, in UK time.
3. Check it locally with `npm run dev` (see [[How to run locally]]).
4. Commit and push to publish (see [[How to deploy to Cloudflare Pages]]).

## Test the tooltip

Your browser is probably on UK time, so you won't see the tooltip. To see it:

- Change your computer's time zone to somewhere else and reload, or
- In browser dev tools (Chrome or Edge): open **Sensors** (in the "⋮" → More tools menu) and set a **Location** or time zone override, then reload.

## Troubleshooting

- **A time shows as plain text with no zone (e.g. `Monday, 28 April. 19:30`)**: the event has no valid `start`. Check the format. It must match `2025-04-28 19:30` exactly, with no extra words.
- **Time is an hour out**: check the date and year. BST runs from the last Sunday of March to the last Sunday of October.
- **Old `time:` field**: this is still supported as a fallback for events that have no `start`, but it can't be converted for visitors. Replace it with `start`.

## How it works

- `src/utils/time.js` converts the UK clock time to a real moment (using the built-in `Europe/London` time zone data) and formats it for the UK or for the visitor.
- `src/components/EventTime.jsx` shows the time and the tooltip.

## Related

- [[How to run locally]]
- [[How to deploy to Cloudflare Pages]]
