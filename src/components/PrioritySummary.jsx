import { useState } from 'react'
import { Box, Text, TextInput, Button } from '@mantine/core'
import './PrioritySummary.css'

export default function PrioritySummary({ events, priorities, onSubmit, submitStatus = 'idle' }) {
  const [discordUsername, setDiscordUsername] = useState('')

  const chosen = Object.entries(priorities)
    .map(([id, priority]) => ({
      priority,
      event: events.find(e => e.id === Number(id))
    }))
    .filter(item => item.event)
    .sort((a, b) => a.priority - b.priority)

  const hasAnySelection = chosen.length > 0
  const isUsernameFilled = discordUsername.trim().length > 0
  const canSubmit = isUsernameFilled && hasAnySelection && submitStatus !== 'submitting'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit?.({ discordUsername: discordUsername.trim() })
  }

  return (
    <Box className="summary-section">
      <Text className="summary-heading">Your Picks</Text>
      {chosen.length === 0 ? (
        <Text className="summary-empty">No priorities set yet — use the numbered buttons on each event above.</Text>
      ) : (
        <div className="summary-list">
          {chosen.map(({ priority, event }) => (
            <div key={event.id} className="summary-row">
              <span className="summary-rank">#{priority}</span>
              <span className="summary-event-title">{event.title}</span>
              <span className="summary-event-meta">{event.time}</span>
            </div>
          ))}
        </div>
      )}

      {submitStatus === 'success' ? (
        <div className="summary-success">
          <Text className="summary-success-text">
            Your choices have been recorded.
          </Text>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="summary-submit-form">
          <TextInput
            label="Discord Username"
            placeholder="e.g. alex#1234 or alex.gm"
            required
            value={discordUsername}
            onChange={(e) => setDiscordUsername(e.currentTarget.value)}
            disabled={submitStatus === 'submitting'}
            classNames={{
              label: 'summary-field-label',
              input: 'summary-field-input',
            }}
          />

          <Button
            type="submit"
            disabled={!canSubmit}
            className="summary-submit-button"
          >
            {submitStatus === 'submitting' ? 'Submitting…' : 'Submit'}
          </Button>

          {!hasAnySelection && (
            <Text className="summary-submit-hint">
              Select a priority on at least one event above before submitting.
            </Text>
          )}

          {submitStatus === 'error' && (
            <Text className="summary-submit-error">
              Something went wrong submitting your picks. Please check your connection and try again.
            </Text>
          )}
        </form>
      )}
    </Box>
  )
}
