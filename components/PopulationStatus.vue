<template>
  <section class="card bg-base-200/60 border border-white/10 shadow-xl">
    <div class="card-body">
      <h2 class="text-2xl md:text-3xl font-whale mb-1">Where they stand</h2>
      <p class="text-base-content/70 mb-6 max-w-2xl">
        IUCN Red List status across the {{ populations.length }} species tracked here. Select a
        status, on the ring or in the list, to filter the abundance chart below.
      </p>

      <div class="grid md:grid-cols-[17rem_1fr] gap-8 items-center">
        <div ref="ringEl" class="mx-auto w-56 h-56 md:w-64 md:h-64">
          <!-- Only the ring is rotated (so arcs start at twelve o'clock); the centre text
               lives in the same unrotated viewBox, so it stays centred at every size. -->
          <svg viewBox="0 0 200 200" class="block w-full h-full overflow-visible" role="img" :aria-label="summary">
            <g transform="rotate(-90 100 100)">
              <circle
                cx="100"
                cy="100"
                :r="radius"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                stroke-width="22"
              />
              <circle
                v-for="(seg, i) in arcs"
                :key="seg.code"
                cx="100"
                cy="100"
                :r="radius"
                fill="none"
                :stroke="seg.color"
                :stroke-width="focus === seg.code ? 27 : 22"
                stroke-linecap="butt"
                :stroke-dasharray="revealed ? `${seg.length} ${circumference}` : `0 ${circumference}`"
                :stroke-dashoffset="seg.offset"
                class="donut-arc cursor-pointer"
                :style="{
                  '--d': `${i * 110}ms`,
                  opacity: focus && focus !== seg.code ? 0.3 : 1,
                  filter: `drop-shadow(0 0 6px ${seg.color}99)`,
                }"
                @click="toggle(seg.code)"
                @mouseenter="hovered = seg.code"
                @mouseleave="hovered = null"
              />
            </g>
            <g class="pointer-events-none select-none" text-anchor="middle">
              <text
                x="100"
                :y="centre.lines.length > 1 ? 85 : 92"
                dominant-baseline="central"
                class="donut-count"
                :fill="centre.color"
              >{{ centre.count }}</text>
              <text
                v-for="(line, i) in centre.lines"
                :key="line"
                x="100"
                :y="(centre.lines.length > 1 ? 112 : 119) + i * 14"
                dominant-baseline="central"
                class="donut-label"
              >{{ line }}</text>
            </g>
          </svg>
        </div>

        <div>
          <ul class="space-y-1.5">
            <li v-for="seg in arcs" :key="seg.code">
              <button
                type="button"
                class="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
                :class="status === seg.code ? 'bg-white/10 ring-1 ring-white/15' : 'hover:bg-white/[0.05]'"
                :aria-pressed="status === seg.code"
                @click="toggle(seg.code)"
                @mouseenter="hovered = seg.code"
                @mouseleave="hovered = null"
                @focus="hovered = seg.code"
                @blur="hovered = null"
              >
                <span
                  class="h-3 w-3 rounded-full flex-none"
                  :style="{ background: seg.color, boxShadow: `0 0 8px ${seg.color}` }"
                />
                <span class="text-sm text-base-content/85">{{ seg.label }}</span>
                <span class="ml-auto tabular-nums text-sm text-base-content/60">{{ seg.count }}</span>
                <span class="text-xs text-base-content/55 w-10 text-right tabular-nums">{{ seg.share }}%</span>
              </button>
            </li>
          </ul>

          <!-- Says what the filter did, since the chart it drives sits below the fold. -->
          <div class="mt-4 min-h-6 text-sm text-base-content/65" aria-live="polite">
            <div v-if="statusLabel" class="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>Showing only {{ statusLabel }} species in the chart below.</span>
              <a href="#how-many-left" class="link link-primary link-hover inline-flex items-center gap-1">
                Jump to chart
                <ArrowDownIcon class="h-3.5 w-3.5" />
              </a>
              <button type="button" class="link link-hover" @click="status = 'all'">Show all</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowDownIcon } from '@heroicons/vue/24/outline'
import type { IucnCode } from '~/types/species'
import { populations } from '~/data/population'
import { iucnMeta } from '~/data/iucn'

const status = defineModel<'all' | IucnCode>('status', { default: 'all' })

const radius = 72
const circumference = 2 * Math.PI * radius
const order: IucnCode[] = ['CR', 'EN', 'VU', 'NT', 'LC', 'DD']

const arcs = computed(() => {
  const total = populations.length
  const segs = order
    .map(code => ({
      code,
      label: iucnMeta[code].label,
      color: iucnMeta[code].color,
      count: populations.filter(p => p.iucnCode === code).length,
    }))
    .filter(s => s.count > 0)

  let cursor = 0
  const gap = 3
  return segs.map((s) => {
    const raw = (s.count / total) * circumference
    const length = Math.max(raw - gap, 1)
    const offset = -cursor
    cursor += raw
    return {
      ...s,
      length,
      offset,
      share: Math.round((s.count / total) * 100),
    }
  })
})

const summary = computed(() =>
  `IUCN Red List status of ${populations.length} species: `
  + arcs.value.map(s => `${s.count} ${s.label}`).join(', ')
  + '.',
)

// Hovering (or focusing) a status previews it; the selection is the fallback.
const hovered = ref<IucnCode | null>(null)
const focus = computed<IucnCode | null>(() => hovered.value ?? (status.value === 'all' ? null : status.value))

const centre = computed(() => {
  const code = focus.value
  if (!code) return { count: populations.length, lines: ['species'], color: '#00f0ff' }
  const label = iucnMeta[code].label
  return {
    count: populations.filter(p => p.iucnCode === code).length,
    // "Critically Endangered" is too wide for the hole on one line.
    lines: label.length > 16 ? label.split(' ') : [label],
    color: iucnMeta[code].color,
  }
})

const statusLabel = computed(() => (status.value === 'all' ? '' : iucnMeta[status.value].label))

function toggle(code: IucnCode) {
  status.value = status.value === code ? 'all' : code
}

// Draw the ring in once, the first time it scrolls into view. The prerendered page
// (and visitors who prefer reduced motion) get the finished ring straight away.
const ringEl = ref<HTMLElement | null>(null)
const revealed = ref(true)
onMounted(() => {
  const el = ringEl.value
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return
  revealed.value = false
  const { stop } = useIntersectionObserver(el, ([entry]) => {
    if (!entry?.isIntersecting) return
    revealed.value = true
    stop()
  }, { threshold: 0.4 })
})
</script>

<style scoped>
.donut-arc {
  transition:
    stroke-dasharray 0.9s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms),
    stroke-width 0.3s ease,
    opacity 0.25s ease;
}
.donut-count {
  font-family: var(--font-whale);
  font-size: 46px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  transition: fill 0.25s ease;
}
.donut-label {
  font-family: var(--font-sans);
  font-size: 11px;
  letter-spacing: 0.02em;
  fill: rgba(224, 242, 254, 0.62);
}
@media (prefers-reduced-motion: reduce) {
  .donut-arc,
  .donut-count {
    transition: none;
  }
}
</style>
