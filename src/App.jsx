import { useEffect, useState } from 'react'
import { Title, Text } from '@mantine/core'
import { events, selectableEvents } from './events/index.js'
import { SUBMIT_ENDPOINT_URL } from './config.js'
import EventSection, { makeSparkles } from './components/EventSection'
import InfoSection from './components/InfoSection'
import PrioritySummary from './components/PrioritySummary'
import LightningStorm from './components/LightningStorm'
import { primeThunder } from './utils/thunder'
import './App.css'

export default function App() {
  const [priorities, setPriorities] = useState({})
  // submitStatus: 'idle' | 'submitting' | 'success' | 'error'
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [titleSparkles, setTitleSparkles] = useState(null)
  // Bumped to set off a thunder-and-lightning storm
  const [stormKey, setStormKey] = useState(0)
  const totalSelectable = selectableEvents.length

  // Fairy sparkles flutter round the page title once when it loads
  useEffect(() => {
    setTitleSparkles(makeSparkles(16))
    const timer = setTimeout(() => setTitleSparkles(null), 7000)
    return () => clearTimeout(timer)
  }, [])
  // The page title comes from the front matter title of the first info card (info-1-welcome.md)
  const seasonTitle = events.find(e => e.type === 'info')?.title ?? ''

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

  const startStorm = () => {
    primeThunder()
    setStormKey(k => k + 1)
  }

  const handleSubmit = async ({ discordUsername }) => {
    // Unlock audio while still inside the click, so the thunder can play once the request returns
    primeThunder()
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
        setStormKey(k => k + 1)
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
        <div className="event-title-wrap">
          {titleSparkles?.map((s, i) => (
            <span key={i} className="title-sparkle" style={s} aria-hidden="true" />
          ))}
          <Title className="app-title">{seasonTitle}</Title>
        </div>
        <Text className="app-subtitle">
          Select the games you would like you play, indicating your priority.
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
        onTestStorm={startStorm}
      />

      <LightningStorm stormKey={stormKey} />
    </div>
  )
}
