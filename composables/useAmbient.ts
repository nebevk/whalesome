export type DayPhase = 'dawn' | 'day' | 'dusk' | 'night'

interface PhaseMeta {
  label: string
  /** Seven gradient stops, surface to abyss, for the homepage ocean background. */
  stops: string[]
}

/**
 * Each part of the day gets its own surface palette. The deep stops stay close
 * to black across all of them, so only the top of the water shifts colour.
 */
export const phaseMeta: Record<DayPhase, PhaseMeta> = {
  dawn: { label: 'Dawn', stops: ['#e0907a', '#b06a86', '#6a5a86', '#2a3a5c', '#0a1d33', '#03101f', '#00060e'] },
  day: { label: 'Day', stops: ['#5cb3e0', '#3690c4', '#1a6a9a', '#0d456b', '#082a45', '#04162b', '#00060e'] },
  dusk: { label: 'Dusk', stops: ['#d8753c', '#9c4a6a', '#5a3a6a', '#26314f', '#0a1a30', '#03101f', '#00060e'] },
  night: { label: 'Night', stops: ['#0c2a44', '#0a2038', '#08182c', '#061122', '#040b18', '#02070f', '#00040a'] },
}

const PERCENTS = [0, 12, 24, 42, 60, 80, 100]

export function gradientFor(phase: DayPhase): string {
  const stops = phaseMeta[phase].stops
  const parts = stops.map((c, i) => `${c} ${PERCENTS[i]}%`).join(', ')
  return `linear-gradient(to bottom, ${parts})`
}

export function phaseForHour(h: number): DayPhase {
  if (h >= 5 && h < 8) return 'dawn'
  if (h >= 8 && h < 17) return 'day'
  if (h >= 17 && h < 21) return 'dusk'
  return 'night'
}

// TEMPORARY demo: when true, "follow time of day" cycles a full day in about
// 60 seconds so the effect is easy to see. Set to false to track the real clock.
const DEMO_MINUTE_CYCLE = true

// ---- Web Audio underwater ambience (synthesized, no asset to load) ----
let ctx: AudioContext | null = null
let gain: GainNode | null = null
let started = false
let demoStart = 0

function buildAudio() {
  if (ctx) return
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  ctx = new Ctx()

  // Brown noise loop = the low ocean wash.
  const seconds = 4
  const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    data[i] = last * 3.5
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer
  noise.loop = true

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 360
  filter.Q.value = 0.6

  // Slow swell that opens and closes the filter, like distant currents.
  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.06
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 130
  lfo.connect(lfoGain).connect(filter.frequency)

  gain = ctx.createGain()
  gain.gain.value = 0

  noise.connect(filter).connect(gain).connect(ctx.destination)
  noise.start()
  lfo.start()
  started = true
}

function fadeTo(target: number, seconds = 1.2) {
  if (!ctx || !gain) return
  const now = ctx.currentTime
  gain.gain.cancelScheduledValues(now)
  gain.gain.setValueAtTime(gain.gain.value, now)
  gain.gain.linearRampToValueAtTime(target, now + seconds)
}

/**
 * Single shared ambient controller: synthesized underwater sound plus an
 * optional clock that re-tints the ocean gradient to match the time of day.
 * State lives in useState so it is shared across every component instance.
 */
export function useAmbient() {
  const soundOn = useState('ambient:sound', () => false)
  const timeTheme = useState('ambient:timeTheme', () => false)
  const volume = useState('ambient:volume', () => 0.5)
  const phase = useState<DayPhase>('ambient:phase', () => 'day')
  const hydrated = useState('ambient:hydrated', () => false)

  const gradient = computed(() => gradientFor(phase.value))
  const phaseLabel = computed(() => phaseMeta[phase.value].label)

  function refreshPhase() {
    if (DEMO_MINUTE_CYCLE) {
      if (!demoStart) demoStart = Date.now()
      const virtualHour = ((Date.now() - demoStart) / 60000) * 24 % 24
      phase.value = phaseForHour(virtualHour)
    }
    else {
      phase.value = phaseForHour(new Date().getHours())
    }
  }

  function applySound() {
    if (!import.meta.client) return
    if (soundOn.value) {
      buildAudio()
      ctx?.resume()
      fadeTo(volume.value * 0.5)
    }
    else if (started) {
      fadeTo(0)
    }
  }

  function persist() {
    if (!import.meta.client) return
    localStorage.setItem('whalesome:ambient', JSON.stringify({
      soundOn: soundOn.value,
      timeTheme: timeTheme.value,
      volume: volume.value,
    }))
  }

  function init() {
    if (!import.meta.client || hydrated.value) return
    hydrated.value = true
    try {
      const raw = localStorage.getItem('whalesome:ambient')
      if (raw) {
        const saved = JSON.parse(raw)
        timeTheme.value = !!saved.timeTheme
        volume.value = typeof saved.volume === 'number' ? saved.volume : 0.5
        // Sound never auto-starts: browsers block audio without a gesture.
      }
    }
    catch {
      // ignore malformed storage
    }
    demoStart = Date.now()
    refreshPhase()
  }

  function toggleSound() {
    soundOn.value = !soundOn.value
    applySound()
    persist()
  }

  function toggleTimeTheme() {
    timeTheme.value = !timeTheme.value
    if (timeTheme.value) refreshPhase()
    persist()
  }

  function setVolume(v: number) {
    volume.value = v
    if (soundOn.value) fadeTo(volume.value * 0.5, 0.2)
    persist()
  }

  return {
    soundOn,
    timeTheme,
    volume,
    phase,
    phaseLabel,
    gradient,
    init,
    toggleSound,
    toggleTimeTheme,
    setVolume,
    refreshPhase,
  }
}
