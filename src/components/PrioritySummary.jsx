import { useState } from 'react'
import { Box, Text, TextInput, Button } from '@mantine/core'
import EventTime from './EventTime'
import './PrioritySummary.css'

// The storm test button only shows in dev mode, or on any build when the URL has ?test
const showTestButton = import.meta.env.DEV || new URLSearchParams(window.location.search).has('test')

export default function PrioritySummary({ events, priorities, onSubmit, submitStatus = 'idle', onTestStorm, signupsOpen = true }) {
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
              <span className="summary-event-meta"><EventTime event={event} /></span>
            </div>
          ))}
        </div>
      )}

      {!signupsOpen ? (
        <button type="button" className="summary-closed" onClick={onTestStorm}>
          The season is now closed for players
        </button>
      ) : submitStatus === 'success' ? (
        <div className="summary-success">
          <Text className="summary-success-text">
            Your choices have been recorded.
          </Text>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="summary-submit-form">
          <TextInput
            label="Discord Username"
            placeholder="(your name here)"
            required
            value={discordUsername}
            onChange={(e) => setDiscordUsername(e.currentTarget.value)}
            disabled={submitStatus === 'submitting'}
            classNames={{
              label: 'summary-field-label',
              input: 'summary-field-input',
            }}
          />

          <div className="summary-button-row">
            <Button
              type="submit"
              disabled={!canSubmit}
              className="summary-submit-button"
            >
              {submitStatus === 'submitting' ? 'Submitting…' : 'Submit'}
            </Button>

            {showTestButton && (
              <Button
                type="button"
                variant="outline"
                onClick={onTestStorm}
                className="summary-test-button"
              >
                Test storm
              </Button>
            )}
          </div>

          {!hasAnySelection && (
            <Text className="summary-submit-hint">              
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
