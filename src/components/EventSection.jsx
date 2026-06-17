import { Text, Group, Anchor, Tooltip } from '@mantine/core'
import { IconUsers, IconClock, IconShieldHalf, IconExternalLink } from '@tabler/icons-react'
import './EventSection.css'

export default function EventSection({ event, totalEvents, selectedPriority, takenNumbers, onPriorityChange }) {
  const numbers = Array.from({ length: totalEvents }, (_, i) => i + 1)

  return (
    <section className="event-section">
      <div
        className="event-image"
        style={{ backgroundImage: `url(${event.image})` }}
        role="img"
        aria-label={event.title}
      />

      <div className="event-content">
        <Text className="event-title">{event.title}</Text>
        <Text className="event-description">{event.description}</Text>

        <div className="event-meta-row">
          <span className="meta-item">
            <IconClock size={13} className="meta-icon" />
            {event.time} <span className="meta-duration">({event.duration})</span>
          </span>
          <span className="meta-item">
            <IconUsers size={13} className="meta-icon" />
            Max {event.max_players} players
          </span>
          <span className="meta-item">
            <IconShieldHalf size={13} className="meta-icon" />
            Rating: {event.rating}
          </span>
          <span className="meta-item">
            <span className="meta-key">System</span>
            {event.system_url ? (
              <Anchor href={event.system_url} target="_blank" className="event-system-link">
                {event.system}
                <IconExternalLink size={11} style={{ marginLeft: 3, verticalAlign: 'middle' }} />
              </Anchor>
            ) : (
              event.system
            )}
          </span>
          <span className="meta-item">
            <span className="meta-key">GM</span>
            {event.gm}
          </span>
        </div>

        <div className="priority-section">
          <Text className="priority-label">
            {selectedPriority ? `Your priority: #${selectedPriority}` : 'Set your priority'}
          </Text>
          <Group gap={8} className="priority-buttons">
            {numbers.map(n => {
              const isTaken = takenNumbers.includes(n)
              const isSelected = selectedPriority === n
              return (
                <Tooltip
                  key={n}
                  label={isTaken ? 'Already chosen on another event' : isSelected ? 'Click to remove' : `Set priority ${n}`}
                  withArrow
                  position="top"
                >
                  <button
                    className={`priority-btn ${isSelected ? 'priority-btn--selected' : ''} ${isTaken ? 'priority-btn--taken' : ''}`}
                    onClick={() => !isTaken && onPriorityChange(n)}
                    disabled={isTaken}
                    aria-label={`Priority ${n}`}
                  >
                    {n}
                  </button>
                </Tooltip>
              )
            })}
          </Group>
        </div>
      </div>
    </section>
  )
}
