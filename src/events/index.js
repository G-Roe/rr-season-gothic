// Every .md file in this folder is loaded automatically: no need to list new events here.
// Vite resolves the glob at build time, so adding or removing a file is picked up on the next dev reload/build.
const modules = import.meta.glob('./*.md', { query: '?raw', import: 'default', eager: true })

// Order: info cards first, then everything else; within each group by filename
// (natural sort, so event-2 comes before event-10).
const byName = (a, b) => a.localeCompare(b, undefined, { numeric: true })
const isInfo = (path) => path.startsWith('./info-')
const paths = Object.keys(modules).sort(byName)
const raws = [...paths.filter(isInfo), ...paths.filter(p => !isInfo(p))].map(p => modules[p])

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
