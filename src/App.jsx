import { useState } from 'react'
import { Title, Text } from '@mantine/core'
import { events, selectableEvents } from './events/index.js'
import { SUBMIT_ENDPOINT_URL } from './config.js'
import EventSection from './components/EventSection'
import InfoSection from './components/InfoSection'
import PrioritySummary from './components/PrioritySummary'
import './App.css'

export default function App() {
  const [priorities, setPriorities] = useState({})
  // submitStatus: 'idle' | 'submitting' | 'success' | 'error'
  const [submitStatus, setSubmitStatus] = useState('idle')
  const totalSelectable = selectableEvents.length

  const takenByOthers = (excludeEventId) =>
    Object.entries(priorities)
      .filter(([id]) => Number(id) !== excludeEventId)
      .map(([, val]) => val)

  const handlePriorityChange = (eventId, value) => {
    setPriorities(prev => {
      const current = prev[eventId]
      if (current === value) {
        const next = { ...prev }
        delete next[eventId]
        return next
      }
      return { ...prev, [eventId]: value }
    })
  }

  const handleSubmit = async ({ discordUsername }) => {
    setSubmitStatus('submitting')

    // Build a priority(number) -> gamecode lookup from the currently selected events
    const priorityToGamecode = {}
    for (const [eventId, priority] of Object.entries(priorities)) {
      const event = selectableEvents.find(e => e.id === Number(eventId))
      if (event?.gamecode) {
        priorityToGamecode[priority] = event.gamecode
      }
    }

    // Sheet columns are: Timestamp, Player, 1, 2, 3, 4, 5, 6, 7
    // Timestamp is added by the Apps Script itself, so we just send Player + 1..7
    const formData = new URLSearchParams()
    formData.set('Player', discordUsername)
    for (let n = 1; n <= 7; n++) {
      formData.set(String(n), priorityToGamecode[n] || '')
    }

    try {
      const response = await fetch(SUBMIT_ENDPOINT_URL, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const result = await response.json()

      if (result.result === 'success') {
        setSubmitStatus('success')
      } else {
        throw new Error('Unexpected response from server')
      }
    } catch (err) {
      console.error('Submission failed:', err)
      setSubmitStatus('error')
    }
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <Text className="app-eyebrow">-- Raspy Raven :: Player Sign-Up --</Text>
        <Title className="app-title">Folk Horror Season</Title>
        <Text className="app-subtitle">
          Rank the games you'd like to play — 1 is your top pick.
        </Text>
      </header>

      <main>
        {events.map(event =>
          event.type === 'info' ? (
            <InfoSection key={event.id} event={event} />
          ) : (
            <EventSection
              key={event.id}
              event={event}
              totalEvents={totalSelectable}
              selectedPriority={priorities[event.id] ?? null}
              takenNumbers={takenByOthers(event.id)}
              onPriorityChange={(val) => handlePriorityChange(event.id, val)}
            />
          )
        )}
      </main>

      <PrioritySummary
        events={selectableEvents}
        priorities={priorities}
        onSubmit={handleSubmit}
        submitStatus={submitStatus}
      />
    </div>
  )
}
