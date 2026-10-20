<template>
  <div class="card bg-base-200/60 border border-white/10 shadow-xl">
    <div class="card-body">
      <div class="flex flex-wrap items-end justify-between gap-3 mb-1">
        <h2 class="text-2xl md:text-3xl font-whale">Drag through the decades</h2>
        <button class="btn btn-primary btn-sm gap-1" @click="togglePlay">
          <component :is="playing ? PauseIcon : PlayIcon" class="h-4 w-4" />
          {{ playing ? 'Pause' : 'Play' }}
        </button>
      </div>
      <p class="text-base-content/70 mb-5">
        Pick a species, then drag the slider or press play to watch the estimated population rise
        and fall.
      </p>

      <div class="flex flex-wrap gap-2 mb-6">
        <button
          v-for="s in populationHistory"
          :key="s.id"
          type="button"
          class="btn btn-sm"
          :class="selectedId === s.id ? 'btn-primary' : 'btn-ghost border border-white/10'"
          :aria-pressed="selectedId === s.id"
          @click="selectedId = s.id"
        >
          {{ s.name }}
        </button>
      </div>

      <div class="flex items-end justify-between mb-3">
        <div>
          <p class="text-4xl md:text-5xl font-whale text-primary tabular-nums leading-none">
            <span aria-hidden="true">~</span><span class="sr-only">about </span>{{ readout }}
          </p>
          <p class="text-sm text-base-content/60 mt-1">estimated in {{ year }}</p>
        </div>
        <p class="text-xs text-base-content/45 hidden sm:block max-w-xs text-right leading-relaxed">
          {{ series.name }}
        </p>
      </div>

      <svg
        viewBox="0 0 820 340"
        class="w-full h-auto"
        role="img"
        :aria-label="`${series.name} population over time`"
      >
        <defs>
          <linearGradient :id="`pop-area-${uid}`" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.28" />
            <stop offset="100%" stop-color="#00f0ff" stop-opacity="0" />
          </linearGradient>
          <filter :id="`pop-glow-${uid}`" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g>
          <line
            v-for="g in yGrid"
            :key="`g${g.v}`"
            :x1="padL"
            :x2="820 - padR"
            :y1="yScale(g.v)"
            :y2="yScale(g.v)"
            class="grid"
          />
          <text
            v-for="g in yGrid"
            :key="`gt${g.v}`"
            :x="padL - 8"
            :y="yScale(g.v) + 4"
            text-anchor="end"
            class="axis"
          >
            {{ abbr(g.v) }}
          </text>
        </g>
        <text
          v-for="t in xTicks"
          :key="`x${t}`"
          :x="xScale(t)"
          :y="340 - 8"
          text-anchor="middle"
          class="axis"
        >
          {{ t }}
        </text>

        <polyline :points="ghostPoints" class="ghost" fill="none" />
        <polygon :points="areaPoints" :fill="`url(#pop-area-${uid})`" />
        <polyline
          :points="revealedPoints"
          class="line"
          fill="none"
          :filter="`url(#pop-glow-${uid})`"
        />
        <circle
          v-for="(p, i) in revealedDots"
          :key="i"
          :cx="p.x"
          :cy="p.y"
          r="2.5"
          class="mark"
        />
        <line :x1="xScale(year)" :x2="xScale(year)" :y1="padT" :y2="340 - padB" class="cursor" />
        <circle :cx="xScale(year)" :cy="yScale(currentValue)" r="6" class="dot" />
      </svg>

      <input
        v-model.number="year"
        type="range"
        :min="minYear"
        :max="maxYear"
        step="1"
        class="range range-primary range-sm w-full mt-3"
        aria-label="Year"
      >
      <div class="flex justify-between text-xs text-base-content/50 mt-1 tabular-nums">
        <span>{{ minYear }}</span>
        <span>{{ maxYear }}</span>
      </div>

      <p class="text-xs text-base-content/55 mt-4 leading-relaxed">{{ series.note }}</p>
      <p class="text-xs text-base-content/45 mt-2 leading-relaxed">
        Approximate reconstructions from catch records and survey estimates. Values between data
        points are interpolated.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlayIcon, PauseIcon } from '@heroicons/vue/24/solid'
import { formatCount } from '~/data/population'
import { populationHistory } from '~/data/populationHistory'

const uid = useId().replace(/:/g, '')
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

// Data-point years show the listed figure (so 2026 matches every other chart). Years in
// between are interpolated, so round them to two significant figures rather than imply
// a precise count (63,412 reads as 63,000; 437 as 440).
const readout = computed(() => {
  const v = currentValue.value
  if (v < 100 || series.value.series.some(p => p.year === year.value)) return formatCount(v)
  const step = 10 ** (Math.floor(Math.log10(v)) - 1)
  return formatCount(Math.round(v / step) * step)
})

const ghostPoints = computed(() => series.value.series.map(p => `${xScale(p.year)},${yScale(p.value)}`).join(' '))

const revealedList = computed(() => {
  const pts = series.value.series.filter(p => p.year <= year.value).map(p => ({ x: xScale(p.year), y: yScale(p.value) }))
  pts.push({ x: xScale(year.value), y: yScale(currentValue.value) })
  return pts
})
const revealedDots = computed(() =>
  series.value.series.filter(p => p.year <= year.value).map(p => ({ x: xScale(p.year), y: yScale(p.value) })),
)
const revealedPoints = computed(() => revealedList.value.map(p => `${p.x},${p.y}`).join(' '))
const areaPoints = computed(() => {
  const base = 340 - padB
  const first = revealedList.value[0]
  const last = revealedList.value[revealedList.value.length - 1]
  return `${first.x},${base} ${revealedPoints.value} ${last.x},${base}`
})

const yGrid = computed(() => {
  const m = yMax.value
  return [0, m / 4, m / 2, (3 * m) / 4, m].map(v => ({ v: Math.round(v) }))
})
const xTicks = computed(() => {
  const a = minYear.value
  const b = maxYear.value
  const mid = Math.round((a + b) / 2)
  return [a, mid, b]
})

function abbr(n: number) {
  // Integer rounding: toFixed(1) would turn 1,950,000 into "1.9M".
  if (n >= 1e6) return `${Math.round(n / 1e5) / 10}M`
  if (n >= 1e3) return `${Math.round(n / 1e3)}k`
  return String(n)
}

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
.grid { stroke: rgba(0, 240, 255, 0.08); stroke-width: 1; }
.axis { fill: rgba(224, 242, 254, 0.45); font-size: 12px; font-family: var(--font-sans); }
.ghost { stroke: rgba(160, 220, 255, 0.16); stroke-width: 2; }
.line { stroke: #00f0ff; stroke-width: 2.5; stroke-linejoin: round; stroke-linecap: round; }
.cursor { stroke: rgba(255, 62, 200, 0.55); stroke-width: 1.5; stroke-dasharray: 4 4; }
.dot { fill: #ff3ec8; stroke: #fff; stroke-width: 1.5; }
.mark { fill: #00f0ff; }
</style>
