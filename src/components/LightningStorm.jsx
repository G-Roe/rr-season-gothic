import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { playThunder } from '../utils/thunder'
import './LightningStorm.css'

const rand = (min, max) => min + Math.random() * (max - min)

// Midpoint displacement: split the line in two and jitter the middle, until segments are short
function jaggedPath(a, b, roughness) {
  const points = [a]
  const split = (p, q) => {
    const len = Math.hypot(q.x - p.x, q.y - p.y)
    if (len < 8) { points.push(q); return }
    const mid = {
      x: (p.x + q.x) / 2 + (Math.random() - 0.5) * len * roughness,
      y: (p.y + q.y) / 2 + (Math.random() - 0.5) * len * roughness * 0.3,
    }
    split(p, mid)
    split(mid, q)
  }
  split(a, b)
  return points
}

// A bolt is a main channel plus forks that peel off it, and forks off those forks
function buildBolt(start, end, width, depth = 0) {
  const points = jaggedPath(start, end, depth === 0 ? 0.45 : 0.6)
  const strokes = [{ points, width }]
  if (depth < 3) {
    const forkChance = depth === 0 ? 0.04 : 0.03
    for (let i = 3; i < points.length - 4; i++) {
      if (Math.random() > forkChance) continue
      const p = points[i]
      const heading = Math.atan2(end.y - p.y, end.x - p.x)
      const angle = heading + (Math.random() < 0.5 ? -1 : 1) * rand(0.35, 0.9)
      const length = Math.hypot(end.x - p.x, end.y - p.y) * rand(0.25, 0.55)
      const forkEnd = { x: p.x + Math.cos(angle) * length, y: p.y + Math.sin(angle) * length }
      strokes.push(...buildBolt(p, forkEnd, width * 0.55, depth + 1))
    }
  }
  return strokes
}

function drawBolt(canvas, originX) {
  const dpr = window.devicePixelRatio || 1
  const w = window.innerWidth
  const h = window.innerHeight
  canvas.width = w * dpr
  canvas.height = h * dpr
  const g = canvas.getContext('2d')
  g.setTransform(dpr, 0, 0, dpr, 0, 0)
  g.clearRect(0, 0, w, h)
  g.lineCap = 'round'
  g.lineJoin = 'round'

  const start = { x: originX * w, y: -20 }
  const end = { x: start.x + rand(-0.3, 0.3) * w, y: rand(0.65, 1) * h }
  const strokes = buildBolt(start, end, rand(2.5, 4))

  // Wide violet glow, then a pale halo, then the white-hot core
  const passes = [
    { blur: 28, color: 'rgba(150, 130, 255, 0.55)', scale: 3 },
    { blur: 10, color: 'rgba(215, 205, 255, 0.85)', scale: 1.6 },
    { blur: 0, color: 'rgba(255, 255, 255, 1)', scale: 0.6 },
  ]
  for (const pass of passes) {
    g.shadowBlur = pass.blur
    g.shadowColor = pass.color
    g.strokeStyle = pass.color
    for (const { points, width } of strokes) {
      g.lineWidth = Math.max(0.6, width * pass.scale)
      g.beginPath()
      g.moveTo(points[0].x, points[0].y)
      for (const p of points.slice(1)) g.lineTo(p.x, p.y)
      g.stroke()
    }
  }
}

// Each strike: [ms after the storm starts, opacity keyframes, duration]
const STRIKES = [
  { at: 0, frames: [0, 1, 0.15, 0.9, 0], duration: 750 },
  { at: 1300, frames: [0, 0.85, 0], duration: 450 },
  { at: 2200, frames: [0, 0.5, 0.1, 0.35, 0], duration: 700 },
]

// Plays thunder and forked lightning across the page background every time `stormKey` changes.
export default function LightningStorm({ stormKey }) {
  const canvasRef = useRef(null)
  const skyRef = useRef(null)
  const flashRef = useRef(null)

  useEffect(() => {
    if (!stormKey) return

    playThunder(0.12)

    // Flashing is skipped for anyone who has asked their system to reduce motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timers = STRIKES.map(({ at, frames, duration }) => setTimeout(() => {
      const originX = rand(0.15, 0.85)
      drawBolt(canvasRef.current, originX)
      skyRef.current.style.setProperty('--strike-x', `${originX * 100}%`)
      const timing = { duration, easing: 'linear' }
      canvasRef.current.animate(frames.map(opacity => ({ opacity })), timing)
      skyRef.current.animate(frames.map(opacity => ({ opacity })), timing)
      flashRef.current.animate(frames.map(o => ({ opacity: o * 0.3 })), timing)
    }, at))

    return () => timers.forEach(clearTimeout)
  }, [stormKey])

  return createPortal(
    <>
      <div className="storm-back" aria-hidden="true">
        <div ref={skyRef} className="storm-sky" />
        <canvas ref={canvasRef} className="storm-canvas" />
      </div>
      <div ref={flashRef} className="storm-flash" aria-hidden="true" />
    </>,
    document.body
  )
}
