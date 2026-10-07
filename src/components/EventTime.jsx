import { Tooltip } from '@mantine/core'
import { parseUkTime, formatUk, viewerTooltip } from '../utils/time'
import './EventTime.css'

// Shows an event's start time in UK time. If the viewer is in a different
// time zone, a tooltip gives the time in their own zone.
// Falls back to the plain `time` text for events without a `start` field.
export default function EventTime({ event }) {
  const date = parseUkTime(event.start)
  if (!date) return <>{event.time}</>

  const label = viewerTooltip(date)
  const text = formatUk(date)
  if (!label) return <>{text}</>

  return (
    <Tooltip
      label={label}
      withArrow
      multiline
      w={280}
      classNames={{ tooltip: 'event-time-tooltip' }}
      events={{ hover: true, focus: true, touch: true }}
    >
      <span className="event-time--local" tabIndex={0}>{text}</span>
    </Tooltip>
  )
}
