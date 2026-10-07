import { useEffect, useRef, useState } from 'react'
import { Text, Group, Anchor, Tooltip } from '@mantine/core'
import ReactMarkdown from 'react-markdown'
import { IconUsers, IconClock, IconShieldHalf, IconExternalLink } from '@tabler/icons-react'
import EventTime from './EventTime'
import './EventSection.css'
import './InfoSection.css'



const rand = (min, max) => min + Math.random() * (max - min)

export function makeSparkles(count = 12) {
  return Array.from({ length: count }, () => ({
    left: `${rand(-6, 104)}%`,
    top: `${rand(-30, 120)}%`,
    '--size': `${rand(3, 6)}px`,
    '--dur': `${rand(3, 5)}s`,
    '--delay': `${rand(0, 1.5)}s`,
    '--x1': `${rand(-22, 22)}px`, '--y1': `${rand(-18, 18)}px`,
    '--x2': `${rand(-30, 30)}px`, '--y2': `${rand(-24, 24)}px`,
    '--x3': `${rand(-40, 40)}px`, '--y3': `${rand(-30, 30)}px`,
  }))
}

export default function EventSection({ event, totalEvents, selectedPriority, takenNumbers, onPriorityChange }) {
  const numbers = Array.from({ length: totalEvents }, (_, i) => i + 1)
  const titleRef = useRef(null)
  const [sparkles, setSparkles] = useState(null)

  // Fairy sparkles flutter round the title the first time it enters the top half of the viewport
  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    let timer
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      setSparkles(makeSparkles())
      timer = setTimeout(() => setSparkles(null), 7000)
    }, { rootMargin: '0px 0px -50% 0px' })
    observer.observe(el)
    return () => { observer.disconnect(); clearTimeout(timer) }
  }, [])

  return (
    <section className="event-section">
      <div
        className="event-image event-image--smoke"
        style={{ backgroundImage: `url(${event.image})` }}
        role="img"
        aria-label={event.title}
      />

      <div className="event-content">
        <div className="event-title-wrap" ref={titleRef}>
          {sparkles?.map((s, i) => (
            <span key={i} className="title-sparkle" style={s} aria-hidden="true" />
          ))}
          <Text className="event-title">{event.title}</Text>
        </div>
        <div className="event-description info-markdown">
          <ReactMarkdown>{event.description}</ReactMarkdown>
        </div>

        <div className="event-meta-row">
          <span className="meta-item">
            <IconClock size={13} className="meta-icon" />
            <EventTime event={event} /> <span className="meta-duration">({event.duration})</span>
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
          {event.tech && (
            <span className="meta-item">
              <span className="meta-key">Tech</span>
              {event.tech}
            </span>
          )}
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
