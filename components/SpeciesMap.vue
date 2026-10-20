<template>
  <div>
    <!-- Not a <figure>: DaisyUI turns `.card figure` into a centred flex row, which collapses the map. -->
    <div class="relative aspect-[2/1] rounded-lg overflow-hidden border border-base-300 bg-base-300">
      <svg
        :viewBox="frame.viewBox"
        class="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <path :d="SPHERE" fill="#071b2d" />
        <path
          :d="GRATICULE"
          fill="none"
          stroke="rgba(160, 220, 255, 0.07)"
          stroke-width="1"
          vector-effect="non-scaling-stroke"
        />
        <image :href="frame.land" x="0" y="0" :width="W" :height="H" />
      </svg>

      <!-- Markers are HTML so they stay the same size at any zoom or screen width. -->
      <span
        v-for="(m, i) in markers"
        :key="m.label"
        class="absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center h-5 w-5 rounded-full bg-secondary text-[10px] font-bold leading-none text-secondary-content ring-2 shadow-[0_0_12px_rgba(255,62,200,0.65)] transition-transform duration-200"
        :class="active === i ? 'scale-125 ring-primary z-10' : 'ring-primary/50'"
        :style="{ left: `${m.left}%`, top: `${m.top}%` }"
        aria-hidden="true"
        @mouseenter="active = i"
        @mouseleave="active = null"
      >
        {{ i + 1 }}
      </span>
    </div>

    <ol class="grid sm:grid-cols-2 gap-x-6 gap-y-2 mt-4 text-sm">
      <li
        v-for="(m, i) in markers"
        :key="m.label"
        class="flex items-center gap-2.5 transition-colors"
        :class="active === i ? 'text-primary' : 'text-base-content/80'"
        @mouseenter="active = i"
        @mouseleave="active = null"
      >
        <span
          class="grid place-items-center h-5 w-5 flex-none rounded-full bg-secondary/15 text-[10px] font-bold text-secondary ring-1 ring-secondary/40"
          aria-hidden="true"
        >
          {{ i + 1 }}
        </span>
        {{ m.label }}
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import type { HabitatRegion } from '~/types/species'

const props = defineProps<{ regions: HabitatRegion[] }>()

const active = ref<number | null>(null)

// Equal Earth projection. The land files in public/maps/ were generated with d3-geo's
// geoEqualEarth at this exact scale and size, so hotspots and coastlines line up.
// Atlantic-centred and Pacific-centred variants exist so ranges that straddle the
// date line (Dall's porpoise, gray whale) stay in one piece.
const A1 = 1.340264, A2 = -0.081106, A3 = 0.000893, A4 = 0.003796, M = Math.sqrt(3) / 2
const W = 1000
const S = W / 2 / (Math.PI / (M * A1))
const H = 486.7
const ASPECT = 2
/** Smallest window, in map units (about 11° of longitude): close enough to separate the vaquita's hotspots, wide enough to keep some coastline for context. */
const MIN_SPAN = 30
const MIN_PAD = 8
const LAND = { 0: '/maps/world-land.svg', 180: '/maps/world-land-pacific.svg' } as const
type CentralMeridian = keyof typeof LAND

function project(lat: number, lng: number, lon0: number = 0): [number, number] {
  const lambda = ((((lng - lon0 + 540) % 360) + 360) % 360 - 180) * Math.PI / 180
  const theta = Math.asin(M * Math.sin(lat * Math.PI / 180))
  const t2 = theta * theta, t6 = t2 * t2 * t2
  const x = lambda * Math.cos(theta) / (M * (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2)))
  const y = theta * (A1 + A2 * t2 + t6 * (A3 + A4 * t2))
  return [W / 2 + S * x, H / 2 - S * y]
}

const line = (pts: [number, number][]) =>
  pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('')
const range = (from: number, to: number, step: number) =>
  Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step)

// The projection's outline: the ±180° meridians joined by the flat poles.
const SPHERE = line([
  ...range(-90, 90, 5).map(lat => project(lat, -179.999)),
  ...range(-90, 90, 5).reverse().map(lat => project(lat, 179.999)),
]) + 'Z'

const GRATICULE = [
  ...range(-150, 150, 30).map(lng => line(range(-90, 90, 5).map(lat => project(lat, lng)))),
  ...range(-60, 60, 30).map(lat => line(range(-180, 180, 5).map(lng => project(lat, Math.max(-179.999, Math.min(179.999, lng)))))),
].join('')

function bounds(lon0: number) {
  const pts = props.regions.map(r => project(r.lat, r.lng, lon0))
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1])
  return { pts, x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) }
}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi)

/** Longitude spread in degrees as seen from a central meridian (projected widths would mislead: meridians converge toward the edges). */
function lngSpan(lon0: number) {
  const rel = props.regions.map(r => (((r.lng - lon0 + 540) % 360) + 360) % 360 - 180)
  return Math.max(...rel) - Math.min(...rel)
}

const frame = computed(() => {
  // Centre on the Pacific only when that clearly tightens the spread.
  const usePacific = lngSpan(180) < 0.8 * lngSpan(0)
  const lon0: CentralMeridian = usePacific ? 180 : 0
  const b = bounds(lon0)

  const bw = b.x1 - b.x0, bh = b.y1 - b.y0
  const pad = Math.max(0.25 * Math.max(bw, bh), MIN_PAD)
  let vw = Math.max(bw + 2 * pad, (bh + 2 * pad) * ASPECT, MIN_SPAN)
  let vx: number, vy: number

  if (vw >= 0.7 * W) {
    // Wide ranges get the whole world rather than an awkward crop.
    vw = W
    vx = 0
    vy = (H - W / ASPECT) / 2
  }
  else {
    const vh = vw / ASPECT
    vx = clamp((b.x0 + b.x1) / 2 - vw / 2, 0, W - vw)
    vy = clamp((b.y0 + b.y1) / 2 - vh / 2, 0, H - vh)
  }
  const vh = vw / ASPECT

  return {
    land: LAND[lon0],
    viewBox: `${vx.toFixed(1)} ${vy.toFixed(1)} ${vw.toFixed(1)} ${vh.toFixed(1)}`,
    pts: b.pts,
    vx, vy, vw, vh,
  }
})

// Rounded because Node's and the browser's trig differ in the last bits, which would
// otherwise make every marker's inline style a hydration mismatch.
const pct = (v: number) => Math.round(v * 1000) / 1000

const markers = computed(() => {
  const { pts, vx, vy, vw, vh } = frame.value
  return props.regions.map((r, i) => ({
    label: r.label,
    left: pct(((pts[i][0] - vx) / vw) * 100),
    top: pct(((pts[i][1] - vy) / vh) * 100),
  }))
})
</script>
