import { Text } from '@mantine/core'
import ReactMarkdown from 'react-markdown'
import './EventSection.css'
import './InfoSection.css'

export default function InfoSection({ event }) {
  return (
    <section className="info-section">
      <div
        className="event-image"
        style={{ backgroundImage: `url(${event.image})` }}
        role="img"
        aria-label={event.title}
      />
      <div>
        <Text className="event-title">{event.title}</Text>
        <div className="info-markdown">
          <ReactMarkdown>{event.description}</ReactMarkdown>
        </div>
      </div>
    </section>
  )
}
