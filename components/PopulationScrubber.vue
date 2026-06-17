<template>
  <div class="card bg-base-200/60 border border-white/10 shadow-xl">
    <div class="card-body">
      <div class="flex flex-wrap items-center justify-between gap-3 mb-1">
        <h2 class="text-2xl md:text-3xl font-whale">Drag through the decades</h2>
        <select v-model="selectedId" class="select select-bordered select-sm" aria-label="Choose a species">
          <option v-for="s in populationHistory" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>
      <p class="text-base-content/70 mb-4">
        Drag the slider (or press play) to watch the estimated population rise and fall over time.
      </p>

      <!-- Readout -->
      <div class="flex items-end justify-between mb-2">
        <div>
          <p class="text-4xl md:text-5xl font-whale text-primary tabular-nums leading-none">{{ fmt(currentValue) }}</p>
          <p class="text-sm text-base-content/60 mt-1">estimated in {{ year }}</p>
        </div>
        <button class="btn btn-primary btn-sm gap-1" @click="togglePlay">
          <component :is="playing ? PauseIcon : PlayIcon" class="h-4 w-4" />
          {{ playing ? 'Pause' : 'Play' }}
        </button>
      </div>

      <!-- Chart -->
      <svg viewBox="0 0 820 340" class="w-full h-auto" role="img" :aria-label="`${series.name} population over time`">
        <!-- gridlines -->
        <g>
          <line v-for="g in yGrid" :key="`g${g.v}`" :x1="padL" :x2="820 - padR" :y1="yScale(g.v)" :y2="yScale(g.v)" class="grid" />
          <text v-for="g in yGrid" :key="`gt${g.v}`" :x="padL - 8" :y="yScale(g.v) + 4" text-anchor="end" class="axis">{{ abbr(g.v) }}</text>
        </g>
        <!-- x ticks -->
        <text v-for="t in xTicks" :key="`x${t}`" :x="xScale(t)" :y="340 - 8" text-anchor="middle" class="axis">{{ t }}</text>

        <!-- ghost (full) line -->
        <polyline :points="ghostPoints" class="ghost" fill="none" />
        <!-- area under revealed line -->
        <polygon :points="areaPoints" class="area" />
        <!-- revealed line -->
        <polyline :points="revealedPoints" class="line" fill="none" />
        <!-- marker -->
        <line :x1="xScale(year)" :x2="xScale(year)" :y1="padT" :y2="340 - padB" class="cursor" />
        <circle :cx="xScale(year)" :cy="yScale(currentValue)" r="5" class="dot" />
      </svg>

      <!-- Scrubber -->
      <input
        v-model.number="year"
        type="range"
        :min="minYear"
        :max="maxYear"
        step="1"
        class="range range-primary range-sm mt-2"
        aria-label="Year"
      >
      <div class="flex justify-between text-xs text-base-content/50 mt-1 tabular-nums">
        <span>{{ minYear }}</span>
        <span>{{ maxYear }}</span>
      </div>

      <p class="text-xs text-base-content/55 mt-4 leading-relaxed">{{ series.note }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlayIcon, PauseIcon } from '@heroicons/vue/24/solid'
import { populationHistory } from '~/data/populationHistory'

const padL = 56
const padR = 20
const padT = 18
const padB = 30

const selectedId = ref(populationHistory[0].id)
const series = computed(() => populationHistory.find(s => s.id === selectedId.value) ?? populationHistory[0])

const minYear = computed(() => series.value.series[0].year)
const maxYear = computed(() => series.value.series[series.value.series.length - 1].year)
const yMax = computed(() => Math.max(...series.value.series.map(p => p.value)))

const year = ref(populationHistory[0].series[populationHistory[0].series.length - 1].year)

watch(selectedId, () => {
  stop()
  year.value = maxYear.value
})

const xScale = (y: number) => padL + ((y - minYear.value) / (maxYear.value - minYear.value || 1)) * (820 - padL - padR)
const yScale = (v: number) => padT + (1 - v / (yMax.value || 1)) * (340 - padT - padB)

function valueAt(y: number): number {
  const pts = series.value.series
  if (y <= pts[0].year) return pts[0].value
  if (y >= pts[pts.length - 1].year) return pts[pts.length - 1].value
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]
    const b = pts[i + 1]
    if (y >= a.year && y <= b.year) {
      const t = (y - a.year) / (b.year - a.year)
      return Math.round(a.value + (b.value - a.value) * t)
    }
  }
  return pts[pts.length - 1].value
}

const currentValue = computed(() => valueAt(year.value))

const ghostPoints = computed(() => series.value.series.map(p => `${xScale(p.year)},${yScale(p.value)}`).join(' '))

const revealedList = computed(() => {
  const pts = series.value.series.filter(p => p.year <= year.value).map(p => ({ x: xScale(p.year), y: yScale(p.value) }))
  pts.push({ x: xScale(year.value), y: yScale(currentValue.value) })
  return pts
})
const revealedPoints = computed(() => revealedList.value.map(p => `${p.x},${p.y}`).join(' '))
const areaPoints = computed(() => {
  const base = 340 - padB
  const first = revealedList.value[0]
  const last = revealedList.value[revealedList.value.length - 1]
  return `${first.x},${base} ${revealedPoints.value} ${last.x},${base}`
})

const yGrid = computed(() => {
  const m = yMax.value
  return [0, m / 2, m].map(v => ({ v: Math.round(v) }))
})
const xTicks = computed(() => {
  const a = minYear.value
  const b = maxYear.value
  const mid = Math.round((a + b) / 2)
  return [a, mid, b]
})

const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n)
function abbr(n: number) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1e3) return `${Math.round(n / 1e3)}k`
  return String(n)
}

// ---- play / animate ----
const playing = ref(false)
const motion = usePreferredReducedMotion()
let raf = 0
let startTs = 0
let fromYear = 0

function frame(ts: number) {
  if (!startTs) startTs = ts
  const dur = 6000
  const t = Math.min(1, (ts - startTs) / dur)
  year.value = Math.round(fromYear + (maxYear.value - fromYear) * t)
  if (t < 1 && playing.value) raf = requestAnimationFrame(frame)
  else playing.value = false
}
function play() {
  if (motion.value === 'reduce') { year.value = maxYear.value; return }
  playing.value = true
  fromYear = year.value >= maxYear.value ? minYear.value : year.value
  year.value = fromYear
  startTs = 0
  raf = requestAnimationFrame(frame)
}
function stop() {
  playing.value = false
  cancelAnimationFrame(raf)
}
function togglePlay() {
  if (playing.value) stop()
  else play()
}
onBeforeUnmount(stop)
</script>

<style scoped>
.grid { stroke: rgba(255, 255, 255, 0.08); stroke-width: 1; }
.axis { fill: rgba(224, 242, 254, 0.45); font-size: 12px; font-family: var(--font-sans); }
.ghost { stroke: rgba(160, 220, 255, 0.18); stroke-width: 2; }
.line { stroke: #00f0ff; stroke-width: 2.5; stroke-linejoin: round; stroke-linecap: round; }
.area { fill: rgba(0, 240, 255, 0.10); }
.cursor { stroke: rgba(255, 62, 200, 0.5); stroke-width: 1; stroke-dasharray: 4 4; }
.dot { fill: #ff3ec8; stroke: #fff; stroke-width: 1.5; }
</style>
