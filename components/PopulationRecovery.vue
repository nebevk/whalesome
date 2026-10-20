<template>
  <section class="card bg-base-200/60 border border-white/10 shadow-xl">
    <div class="card-body">
      <h2 class="text-2xl md:text-3xl font-whale mb-1">How far they fell</h2>
      <p class="text-base-content/70 mb-2 max-w-2xl">
        Species with a documented pre-whaling baseline. Cyan is what remains; the dim magenta
        track is what was lost. Some have barely begun to recover.
      </p>
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-base-content/55 mb-6">
        <span class="inline-flex items-center gap-1.5">
          <span class="h-2 w-6 rounded-full bg-primary shadow-[0_0_8px_#00f0ff]" />
          Remaining
        </span>
        <span class="inline-flex items-center gap-1.5">
          <span class="h-2 w-6 rounded-full bg-secondary/25" />
          Lost
        </span>
        <span class="text-base-content/55 sm:ml-auto">Select a species for its baseline and notes.</span>
      </div>

      <ul ref="listEl" class="space-y-5">
        <li v-for="(row, i) in recoveryPairs" :key="row.id">
          <button
            type="button"
            class="block w-[calc(100%+0.5rem)] text-left rounded-xl p-1 -m-1 hover:bg-white/[0.03] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            :aria-expanded="openId === row.id"
            :aria-controls="`fell-detail-${row.id}`"
            @click="openId = openId === row.id ? null : row.id"
          >
            <span class="flex items-baseline justify-between gap-3 mb-1.5">
              <span class="font-medium" :class="openId === row.id ? 'text-primary' : ''">{{ row.name }}</span>
              <span class="text-sm font-semibold tabular-nums text-primary">
                {{ row.pctRemaining }}% remaining
              </span>
            </span>
            <span class="relative block h-3.5 rounded-full overflow-hidden bg-secondary/20" aria-hidden="true">
              <span
                class="fell-bar block h-full rounded-full bg-primary"
                :style="{
                  width: (revealed ? Math.max(row.pctRemaining, 1.8) : 0) + '%',
                  '--d': `${i * 90}ms`,
                }"
              />
            </span>
            <span class="flex justify-between text-xs text-base-content/55 mt-1.5 tabular-nums">
              <span>now <span aria-hidden="true">~</span><span class="sr-only">about </span>{{ formatCount(row.estimate) }}</span>
              <span>then <span aria-hidden="true">~</span><span class="sr-only">about </span>{{ formatCount(row.prewhalingApprox) }}</span>
            </span>
          </button>

          <div
            v-if="openId === row.id"
            :id="`fell-detail-${row.id}`"
            class="mt-2 rounded-lg border border-white/10 bg-base-300/40 px-4 py-3"
          >
            <p v-if="row.prewhalingText" class="text-sm text-base-content/75 leading-relaxed">
              {{ row.prewhalingText }}
            </p>
            <p v-if="row.note" class="text-sm text-base-content/70 mt-2 leading-relaxed">{{ row.note }}</p>
            <NuxtLink v-if="row.hasProfile" :to="`/species/${row.id}`" class="btn btn-primary btn-xs gap-1 mt-3">
              {{ row.name }} profile
              <ArrowRightIcon class="h-3.5 w-3.5" />
            </NuxtLink>
          </div>
        </li>
      </ul>

      <p class="text-xs text-base-content/55 mt-6">
        Vaquita are measured against a 1997 baseline of about 600 animals rather than a true
        pre-whaling figure.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import { formatCount, recoveryPairs } from '~/data/population'

const openId = ref<string | null>(null)

// Grow the bars once, the first time the list scrolls into view. The prerendered page
// (and visitors who prefer reduced motion) get the finished bars straight away.
const listEl = ref<HTMLElement | null>(null)
const revealed = ref(true)
onMounted(() => {
  const el = listEl.value
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return
  revealed.value = false
  const { stop } = useIntersectionObserver(el, ([entry]) => {
    if (!entry?.isIntersecting) return
    revealed.value = true
    stop()
  }, { threshold: 0.25 })
})
</script>

<style scoped>
.fell-bar {
  box-shadow: 0 0 12px rgba(0, 240, 255, 0.55);
  transition: width 0.9s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms);
}
@media (prefers-reduced-motion: reduce) {
  .fell-bar {
    transition: none;
  }
}
</style>
