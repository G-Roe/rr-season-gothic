// Event times are written in UK local time (GMT in winter, BST in summer),
// e.g. "2025-04-28 19:30". These helpers turn that into a real instant and
// format it for the UK or for the viewer's own time zone.

const UK_ZONE = 'Europe/London'

const partsFormatter = (timeZone) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

// Offset (in minutes, local minus UTC) of a time zone at a given instant.
function zoneOffsetMinutes(date, timeZone) {
  const parts = {}
  for (const { type, value } of partsFormatter(timeZone).formatToParts(date)) {
    parts[type] = Number(value)
  }
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second)
  return Math.round((asUtc - Math.floor(date.getTime() / 1000) * 1000) / 60000)
}

// "2025-04-28 19:30" (UK local time) -> Date, or null if it can't be parsed.
export function parseUkTime(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/.exec((value ?? '').trim())
  if (!m) return null
  const [y, mo, d, h, mi] = m.slice(1).map(Number)
  const wall = Date.UTC(y, mo - 1, d, h, mi)

  let instant = wall - zoneOffsetMinutes(new Date(wall), UK_ZONE) * 60000
  // Re-check at the candidate instant so times near a clock change resolve correctly.
  const offset = zoneOffsetMinutes(new Date(instant), UK_ZONE)
  instant = wall - offset * 60000
  const date = new Date(instant)
  return Number.isNaN(date.getTime()) ? null : date
}

function format(date, timeZone) {
  const parts = {}
  for (const { type, value } of new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZoneName: 'short',
  }).formatToParts(date)) {
    parts[type] = value
  }
  // en-GB only has names for UK zones ("GMT-4" elsewhere); en-US gives "EDT", "PST", etc.
  const zoneName = timeZone === UK_ZONE
    ? parts.timeZoneName
    : new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' })
        .formatToParts(date)
        .find((p) => p.type === 'timeZoneName')?.value ?? parts.timeZoneName
  return `${parts.weekday}, ${parts.day} ${parts.month}. ${parts.hour}:${parts.minute} ${zoneName}`
}

export const formatUk = (date) => format(date, UK_ZONE)

export function viewerZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || null
  } catch {
    return null
  }
}

// Returns the tooltip text, or null when the viewer is on UK time at that
// moment (or their zone can't be determined).
export function viewerTooltip(date, zone = viewerZone()) {
  if (!zone) return null
  try {
    if (zoneOffsetMinutes(date, zone) === zoneOffsetMinutes(date, UK_ZONE)) return null
    const name = zone.replace(/_/g, ' ')
    return `You appear to be in ${name}, this will be ${format(date, zone)} in your timezone.`
  } catch {
    return null
  }
}
