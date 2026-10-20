<template>
  <Transition name="gauge">
    <div
      v-show="visible"
      ref="root"
      class="pointer-events-none fixed bottom-6 left-6 z-40 hidden items-center gap-3 rounded-full border border-white/10 bg-base-300/60 py-2 pl-3.5 pr-5 shadow-lg shadow-black/30 backdrop-blur-md sm:flex"
      aria-hidden="true"
    >
      <!-- The whole descent at a glance: zone boundaries as ticks, the stretch already
           travelled filled in, and a marker for where you are now. -->
      <div class="relative h-8 w-1 rounded-full bg-white/15">
        <div
          class="absolute inset-x-0 top-0 rounded-full bg-gradient-to-b from-sky-300 to-primary"
          :style="{ height: `${progress * 100}%` }"
        />
        <span
          v-for="t in ZONE_TICKS"
          :key="t"
          class="absolute -left-1 h-px w-3 bg-white/40"
          :style="{ top: `${t * 100}%` }"
        />
        <span
          class="gauge-marker absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          :style="{ top: `${progress * 100}%` }"
        />
      </div>
      <div class="min-w-[7.75rem] leading-tight">
        <p class="text-sm font-semibold tabular-nums text-white">{{ depthLabel }}</p>
        <Transition name="gauge-fade" mode="out-in">
          <p :key="zone" class="text-[0.65rem] uppercase tracking-[0.2em] text-white/75">{{ zone }}</p>
        </Transition>
      </div>

      <Transition name="gauge-note">
        <p
          v-if="note"
          :key="note"
          class="absolute bottom-full left-0 mb-3 w-max max-w-[17rem] rounded-xl border border-white/10 bg-base-300/85 px-3 py-2 text-xs leading-snug text-white/90 shadow-lg backdrop-blur-md"
        >
          {{ note }}
        </p>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
/**
 * A small dive computer for the homepage: how deep the scroll has taken you through the
 * surface-to-abyss gradient, which ocean zone that is, and a short note when you pass a
 * depth a whale on this site is known to reach. Scroll-linked rather than animated, so it
 * only moves when you do; with reduced motion its fades are switched off as well.
 * Decorative, so hidden from assistive tech, and hidden on phones where it would crowd.
 */
const root = ref<HTMLElement | null>(null)

// Scroll progress through the ocean page, mapped to metres. The breakpoints sit where the
// page gradient (pages/index.vue) changes character: sunlit blues turn deep blue at 24%,
// near-black navy at 60%, black from 80%. The depths are the real zone boundaries.
const STOPS: Array<[number, number]> = [[0, 0], [0.24, 200], [0.6, 1000], [0.8, 4000], [1, 5500]]
const ZONE_TICKS = [0.24, 0.6, 0.8]
const ZONES = [
  { from: 4000, name: 'The abyss' },
  { from: 1000, name: 'Midnight zone' },
  { from: 200, name: 'Twilight zone' },
  { from: 0, name: 'Sunlight zone' },
]
// Depths that whales profiled on this site are known to reach. Figures come from
// data/species.ts and data/population.ts (Schorr et al. 2014 for the record dive).
const NOTES = [
  { from: 1000, to: 1500, text: 'Sperm whales regularly dive below 1,000 m to hunt giant squid.' },
  { from: 1500, to: 2000, text: 'Narwhals can dive past 1,500 m under the sea ice.' },
  { from: 2992, to: 4000, text: 'Deeper than any mammal dive on record: 2,992 m, by a Cuvier’s beaked whale.' },
]

const progress = ref(0)
const visible = ref(false)

const depth = computed(() => {
  const p = progress.value
  for (let i = 1; i < STOPS.length; i++) {
    const [p0, d0] = STOPS[i - 1]
    const [p1, d1] = STOPS[i]
    if (p <= p1) return d0 + ((p - p0) / (p1 - p0)) * (d1 - d0)
  }
  return STOPS[STOPS.length - 1][1]
})

// Fine steps near the surface, coarser in the deep, so the reading settles instead of flickering.
const depthLabel = computed(() => {
  const d = depth.value
  const step = d < 200 ? 1 : d < 1000 ? 5 : 10
  return `${(Math.round(d / step) * step).toLocaleString('en-GB')} m`
})
const zone = computed(() => ZONES.find(z => depth.value >= z.from)?.name ?? 'Sunlight zone')
const note = computed(() => NOTES.find(n => depth.value >= n.from && depth.value <= n.to)?.text ?? '')

let page: HTMLElement | null = null
let frame = 0

function update() {
  frame = 0
  const vh = window.innerHeight
  if (page) {
    const r = page.getBoundingClientRect()
    const range = r.height - vh
    progress.value = range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 0
    // Appears once the dive has begun; bows out when the footer (the sea floor) comes up.
    visible.value = progress.value > 0.01 && r.bottom > vh - 2
  }
  else {
    const max = document.documentElement.scrollHeight - vh
    progress.value = max > 0 ? Math.min(1, window.scrollY / max) : 0
    visible.value = progress.value > 0.01
  }
}
function schedule() {
  if (!frame) frame = requestAnimationFrame(update)
}

useEventListener(typeof window !== 'undefined' ? window : null, 'scroll', schedule, { passive: true })
useEventListener(typeof window !== 'undefined' ? window : null, 'resize', schedule, { passive: true })

onMounted(() => {
  page = root.value?.closest<HTMLElement>('.ocean-page') ?? null
  update()
})
onBeforeUnmount(() => cancelAnimationFrame(frame))
</script>

<style scoped>
.gauge-marker {
  box-shadow: 0 0 0 3px rgb(0 240 255 / 0.25), 0 0 10px rgb(0 240 255 / 0.8);
}

.gauge-enter-active,
.gauge-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.gauge-enter-from,
.gauge-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.gauge-fade-enter-active,
.gauge-fade-leave-active {
  transition: opacity 0.25s ease;
}
.gauge-fade-enter-from,
.gauge-fade-leave-to {
  opacity: 0;
}

.gauge-note-enter-active,
.gauge-note-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.gauge-note-enter-from,
.gauge-note-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

@media (prefers-reduced-motion: reduce) {
  .gauge-enter-active,
  .gauge-leave-active,
  .gauge-fade-enter-active,
  .gauge-fade-leave-active,
  .gauge-note-enter-active,
  .gauge-note-leave-active {
    transition: none;
  }
}
</style>
