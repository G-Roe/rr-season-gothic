// Synthesised thunder: no audio file needed, built from filtered noise with the Web Audio API.

let ctx = null

// Browsers only allow audio after a user gesture, so call this directly inside the
// click/submit handler (before any await) to unlock the audio context for later.
export function primeThunder() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return
  if (!ctx) ctx = new AudioCtx()
  if (ctx.state === 'suspended') ctx.resume()
}

// Brown noise: deep, rumbly random noise
function noiseBuffer(seconds) {
  const length = Math.floor(ctx.sampleRate * seconds)
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    data[i] = last * 3.5
  }
  return buffer
}

// One noise layer: source -> filter -> gain envelope -> destination
function layer(dest, { start, seconds, filterType, frequency, q = 0.7, envelope }) {
  const source = ctx.createBufferSource()
  source.buffer = noiseBuffer(seconds)
  const filter = ctx.createBiquadFilter()
  filter.type = filterType
  filter.frequency.value = frequency
  filter.Q.value = q
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, start)
  envelope(gain.gain, start)
  source.connect(filter).connect(gain).connect(dest)
  source.start(start)
  source.stop(start + seconds)
}

const rand = (min, max) => min + Math.random() * (max - min)

export function playThunder(delaySeconds = 0) {
  primeThunder()
  if (!ctx) return

  const t0 = ctx.currentTime + delaySeconds
  const master = ctx.createGain()
  master.gain.value = 0.9
  const compressor = ctx.createDynamicsCompressor()
  master.connect(compressor).connect(ctx.destination)

  // Low rumble that swells in, wobbles as it rolls, then fades smoothly to silence
  layer(master, {
    start: t0, seconds: 4, filterType: 'lowpass', frequency: 140,
    envelope: (g, s) => {
      g.linearRampToValueAtTime(1.3, s + 0.4)
      for (let t = 0.6; t < 2.2; t += rand(0.15, 0.3)) {
        g.linearRampToValueAtTime(1.3 * Math.exp(-t / 2) * rand(0.6, 1.1), s + t)
      }
      g.exponentialRampToValueAtTime(0.001, s + 3.9)
    },
  })

  // Deeper, more distant roll underneath
  layer(master, {
    start: t0 + 0.6, seconds: 3, filterType: 'lowpass', frequency: 90,
    envelope: (g, s) => {
      g.linearRampToValueAtTime(1, s + 0.5)
      g.exponentialRampToValueAtTime(0.001, s + 2.9)
    },
  })
}
