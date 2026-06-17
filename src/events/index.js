import event1 from './event-1-the-hunted.md?raw'
import event2 from './event-2-dee-sanction.md?raw'
import event3 from './event-3-the-terror-beneath.md?raw'
import info1 from './info-1-welcome.md?raw'

// Simple browser-safe frontmatter parser — no Node dependencies
function parseMd(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { attributes: {}, body: raw.trim() }
  const yamlBlock = match[1]
  const body = match[2].trim()
  const attributes = {}
  for (const line of yamlBlock.split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue
    const key = line.slice(0, colonIdx).trim()
    const value = line.slice(colonIdx + 1).trim()
    attributes[key] = value.replace(/^['"]|['"]$/g, '')
  }
  return { attributes, body }
}

const raws = [event1, event2, event3, info1]

export const events = raws.map((raw, i) => {
  const { attributes, body } = parseMd(raw)
  return {
    id: i + 1,
    type: 'event', // default — overridden below if frontmatter specifies one
    ...attributes,
    description: body,
  }
})

// Only "event" cards are selectable/rankable — info cards don't participate
export const selectableEvents = events.filter(e => e.type === 'event')
