<template>
  <section id="how-many-left" class="card bg-base-200/60 border border-white/10 shadow-xl scroll-mt-28">
    <div class="card-body">
      <div class="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 mb-1">
        <div class="max-w-2xl">
          <h2 class="text-2xl md:text-3xl font-whale mb-1">How many are left</h2>
          <p class="text-base-content/70">
            Best current global estimates on a shared log scale. Each step right is ten times more
            animals, so the vaquita and a million-strong porpoise can sit on the same line.
          </p>
        </div>
        <span class="text-sm text-base-content/60 tabular-nums" aria-live="polite">
          {{ visible.length }} of {{ withEstimate.length }} species shown
        </span>
      </div>

      <!-- Filters. Status chips spell out the Red List names from sm up; phones get the
           code, with the full name kept for screen readers and as a tooltip. -->
      <div class="mt-5 grid grid-cols-[3.75rem_minmax(0,1fr)] items-start gap-x-2 gap-y-2.5">
        <span
          id="abundance-group-label"
          class="text-[0.68rem] leading-8 uppercase tracking-[0.18em] text-base-content/55"
        >
          Group
        </span>
        <div class="flex flex-wrap gap-2" role="group" aria-labelledby="abundance-group-label">
          <button
            v-for="opt in groupOptions"
            :key="opt.value"
            type="button"
            class="btn btn-sm rounded-full"
            :class="group === opt.value ? 'btn-primary' : 'btn-ghost border border-white/10'"
            :aria-pressed="group === opt.value"
            @click="group = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>

        <span
          id="abundance-status-label"
          class="text-[0.68rem] leading-8 uppercase tracking-[0.18em] text-base-content/55"
        >
          Status
        </span>
        <div class="flex flex-wrap gap-2" role="group" aria-labelledby="abundance-status-label">
          <button
            type="button"
            class="btn btn-sm rounded-full"
            :class="status === 'all' ? 'btn-primary' : 'btn-ghost border border-white/10'"
            :aria-pressed="status === 'all'"
            @click="status = 'all'"
          >
            Any
          </button>
          <button
            v-for="opt in statusOptions"
            :key="opt.code"
            type="button"
            class="btn btn-sm rounded-full gap-1.5"
            :class="status === opt.code ? 'btn-primary' : 'btn-ghost border border-white/10'"
            :aria-pressed="status === opt.code"
            :title="opt.label"
            @click="status = opt.code"
          >
            <span class="h-2 w-2 flex-none rounded-full" :style="{ background: opt.color }" />
            <span class="sm:hidden">{{ opt.short }}<span class="sr-only">, {{ opt.label }}</span></span>
            <span class="hidden sm:inline">{{ opt.label }}</span>
          </button>
        </div>
      </div>

      <!-- Key -->
      <div class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-xs text-base-content/60">
        <span class="inline-flex items-center gap-1.5">
          <span class="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_#00f0ff]" />
          Baleen
        </span>
        <span class="inline-flex items-center gap-1.5">
          <span class="h-2 w-2 rounded-full bg-secondary shadow-[0_0_8px_#ff3ec8]" />
          Toothed
        </span>
        <span class="inline-flex items-center gap-2">
          <span class="relative h-2.5 w-7" aria-hidden="true">
            <span class="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-base-content/40" />
            <span class="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-base-content/85 ring-2 ring-base-200" />
          </span>
          Bar shows the range, dot the best estimate
        </span>
        <span v-if="showThen" class="inline-flex items-center gap-1.5">
          <span class="h-2.5 w-2.5 rounded-full border-[1.5px] border-base-content/70" aria-hidden="true" />
          Historical baseline
        </span>
        <span class="text-base-content/55 sm:ml-auto">Select a row for its note and source.</span>
      </div>
      <div class="mt-2.5 mb-5 flex flex-wrap items-center gap-x-4 gap-y-2.5 text-xs text-base-content/60">
        <span class="text-[0.68rem] uppercase tracking-[0.18em] text-base-content/55">Trend</span>
        <span v-for="t in trendOrder" :key="t" class="inline-flex items-center gap-1">
          <component :is="trendMeta[t].icon" class="h-4 w-4" :class="trendMeta[t].tone" />
          {{ trendMeta[t].label }}
        </span>
        <label class="inline-flex cursor-pointer items-center gap-2 text-base-content/75 sm:ml-auto">
          <input v-model="showThen" type="checkbox" class="toggle toggle-primary toggle-sm">
          Compare with pre-whaling numbers
        </label>
      </div>

      <!-- Chart. From lg up the rows share one grid (subgrid), so the name column is exactly
           as wide as the longest name and every bar track lines up with the axis. -->
      <div
        ref="chartEl"
        class="lg:grid lg:grid-cols-[max-content_minmax(0,1fr)_max-content] lg:gap-x-6"
      >
        <template v-if="visible.length">
          <div class="lg:col-span-full lg:grid lg:grid-cols-subgrid lg:grid-rows-[2.125rem_auto]">
            <!-- The axis sticks just under the floating nav while the rows scroll past. A sticky
                 grid item can't leave its own grid area, so from lg up the axis spans both rows
                 (top-aligned) and the list starts in row two, under it. -->
            <div
              class="sticky top-[4.5rem] md:top-[5.5rem] z-10 mb-1 rounded-xl border border-white/[0.07] bg-[#081a2c]/90 px-2 py-1.5 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.9)] backdrop-blur-md lg:col-span-full lg:row-start-1 lg:row-end-3 lg:mb-0 lg:grid lg:grid-cols-subgrid lg:items-center lg:self-start lg:px-3"
              aria-hidden="true"
            >
              <span class="hidden text-[0.65rem] uppercase tracking-[0.16em] text-base-content/55 lg:block">
                Animals, log scale
              </span>
              <span class="relative block h-4">
                <span
                  v-for="tick in ticks"
                  :key="tick.n"
                  class="absolute top-0 -translate-x-1/2 text-[0.7rem] leading-4 tabular-nums text-base-content/60"
                  :style="{ left: tick.pct + '%' }"
                >{{ tick.label }}</span>
              </span>
              <span class="hidden text-right text-[0.65rem] uppercase tracking-[0.16em] text-base-content/55 lg:block">
                Best estimate
              </span>
            </div>

            <ul class="flex flex-col gap-y-1 lg:col-span-full lg:row-start-2 lg:grid lg:grid-cols-subgrid">
              <li
                v-for="(row, i) in visible"
                :key="row.id"
                class="transition-opacity duration-300 lg:col-span-full lg:grid lg:grid-cols-subgrid"
                :class="showThen && row.thenPct === null ? 'opacity-50' : ''"
              >
                <button
                  type="button"
                  class="block w-full rounded-xl px-2 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary lg:col-span-full lg:grid lg:grid-cols-subgrid lg:items-center lg:px-3"
                  :class="selectedId === row.id
                    ? 'bg-white/5 ring-1 ring-primary/35'
                    : 'hover:bg-white/[0.04]'"
                  :aria-expanded="selectedId === row.id"
                  :aria-controls="`pop-detail-${row.id}`"
                  @click="toggle(row.id)"
                >
                  <span class="sr-only">{{ summarise(row) }}</span>

                  <span class="flex min-w-0 items-center gap-2" aria-hidden="true">
                    <span class="font-medium leading-tight" :class="selectedId === row.id ? 'text-primary' : ''">
                      {{ row.name }}
                    </span>
                    <StatusBadge :status="row.iucnStatus" short />
                    <span class="ml-auto flex flex-none items-center gap-1.5 pl-1 lg:hidden">
                      <span class="text-xs tabular-nums text-base-content/75">~{{ formatCount(row.estimate) }}</span>
                      <component
                        :is="trendMeta[row.trend].icon"
                        class="h-[1.125rem] w-[1.125rem]"
                        :class="trendMeta[row.trend].tone"
                      />
                    </span>
                  </span>

                  <span class="relative mt-2 block h-7 lg:mt-0" aria-hidden="true">
                    <span
                      v-for="tick in ticks"
                      :key="tick.n"
                      class="absolute inset-y-0 w-px bg-white/5"
                      :style="{ left: tick.pct + '%' }"
                    />
                    <span
                      class="marks absolute inset-0"
                      :class="revealed ? '' : 'marks-hidden'"
                      :style="{ '--d': `${Math.min(i, 16) * 35}ms` }"
                    >
                      <!-- Then-to-now drop, under the current marks -->
                      <template v-if="row.thenPct !== null">
                        <span
                          class="absolute top-1/2 h-0 border-t-[1.5px] border-dashed transition-opacity duration-300"
                          :class="showThen ? 'opacity-60' : 'opacity-0'"
                          :style="{ left: row.estPct + '%', width: (row.thenPct - row.estPct) + '%', borderColor: row.color }"
                        />
                        <span
                          class="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] transition-opacity duration-300"
                          :class="showThen ? 'opacity-100' : 'opacity-0'"
                          :style="{ left: row.thenPct + '%', borderColor: row.color }"
                        />
                      </template>
                      <span
                        class="absolute top-1/2 h-[5px] -translate-y-1/2 rounded-full opacity-90"
                        :style="{
                          left: row.barLeft + '%',
                          width: row.barWidth + '%',
                          background: row.color,
                          boxShadow: `0 0 10px ${row.color}88`,
                        }"
                      />
                      <span
                        class="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-base-200"
                        :style="{ left: row.estPct + '%', background: row.color }"
                      />
                    </span>
                  </span>

                  <span class="hidden items-center justify-end gap-2 lg:flex" aria-hidden="true">
                    <span class="text-sm tabular-nums text-base-content/80">~{{ formatCount(row.estimate) }}</span>
                    <component
                      :is="trendMeta[row.trend].icon"
                      class="h-[1.125rem] w-[1.125rem]"
                      :class="trendMeta[row.trend].tone"
                    />
                  </span>
                </button>

                <div
                  v-if="selectedId === row.id"
                  :id="`pop-detail-${row.id}`"
                  class="mx-2 mb-3 mt-1 rounded-lg border border-white/10 bg-base-300/40 px-4 py-3 lg:col-span-full"
                >
                  <p class="text-sm italic text-base-content/55 mb-1">{{ row.scientificName }}</p>
                  <p class="text-sm text-base-content/80 leading-relaxed">{{ row.currentText }}</p>
                  <p v-if="row.prewhalingText" class="text-sm text-base-content/70 mt-2 leading-relaxed">
                    <span class="text-base-content/60">Historical baseline:</span> {{ row.prewhalingText }}
                  </p>
                  <p v-if="row.note" class="text-sm text-base-content/70 mt-2 leading-relaxed">{{ row.note }}</p>
                  <div class="flex flex-wrap items-center gap-3 mt-3">
                    <a
                      :href="row.source"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-xs text-base-content/60 hover:text-primary inline-flex items-center gap-1"
                    >
                      Source
                      <ArrowTopRightOnSquareIcon class="h-3 w-3" />
                      <span class="sr-only">(opens in a new tab)</span>
                    </a>
                    <NuxtLink v-if="row.hasProfile" :to="`/species/${row.id}`" class="btn btn-primary btn-xs gap-1">
                      {{ row.name }} profile
                      <ArrowRightIcon class="h-3.5 w-3.5" />
                    </NuxtLink>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- A closing axis, so the last rows have the scale right beside them too. -->
          <div class="mt-1 px-2 lg:col-span-full lg:grid lg:grid-cols-subgrid lg:px-3" aria-hidden="true">
            <span class="hidden lg:block" />
            <span class="relative block h-4">
              <span
                v-for="tick in ticks"
                :key="tick.n"
                class="absolute top-0 -translate-x-1/2 text-[0.7rem] leading-4 tabular-nums text-base-content/55"
                :style="{ left: tick.pct + '%' }"
              >{{ tick.label }}</span>
            </span>
            <span class="hidden lg:block" />
          </div>
        </template>

        <div v-else class="text-center py-12 text-base-content/60 lg:col-span-full">
          <p>No species match those filters.</p>
          <button type="button" class="btn btn-ghost btn-sm mt-3" @click="reset">Clear filters</button>
        </div>
      </div>

      <p v-if="noEstimate.length" class="text-xs text-base-content/60 mt-6">
        No reliable global count exists for {{ noEstimateNames }}, so they are left off the
        chart. Only regional or partial surveys exist.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  ArrowRightIcon,
  ArrowTopRightOnSquareIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  MinusIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/vue/24/outline'
import type { Component } from 'vue'
import type { IucnCode, PopulationTrend } from '~/types/species'
import { formatCount, populations, type PopulationEntry } from '~/data/population'
import { iucnMeta } from '~/data/iucn'

const LOG_MIN = 0
const LOG_MAX = Math.log10(2_500_000)

const group = defineModel<'all' | 'baleen' | 'toothed'>('group', { default: 'all' })
const status = defineModel<'all' | IucnCode>('status', { default: 'all' })

const groupOptions = [
  { value: 'all' as const, label: 'All' },
  { value: 'baleen' as const, label: 'Baleen' },
  { value: 'toothed' as const, label: 'Toothed' },
]

// Only the statuses that occur in the data, in Red List order.
const statusOptions = (['CR', 'EN', 'VU', 'NT', 'LC', 'DD'] as IucnCode[])
  .filter(code => populations.some(p => p.iucnCode === code))
  .map(code => ({ code, ...iucnMeta[code] }))

const trendMeta: Record<PopulationTrend, { label: string; icon: Component; tone: string }> = {
  increasing: { label: 'Increasing', icon: ArrowTrendingUpIcon, tone: 'text-primary' },
  stable: { label: 'Stable', icon: MinusIcon, tone: 'text-base-content/60' },
  decreasing: { label: 'Decreasing', icon: ArrowTrendingDownIcon, tone: 'text-secondary' },
  unknown: { label: 'Unknown', icon: QuestionMarkCircleIcon, tone: 'text-base-content/50' },
}
const trendOrder: PopulationTrend[] = ['increasing', 'stable', 'decreasing', 'unknown']

const withEstimate = populations.filter(p => p.currentHigh > 0)
const noEstimate = populations.filter(p => p.currentHigh === 0)

const noEstimateNames = (() => {
  const names = noEstimate.map(p => `the ${p.name}`)
  if (names.length < 3) return names.join(' or ')
  return `${names.slice(0, -1).join(', ')}, or ${names[names.length - 1]}`
})()

function logPct(n: number) {
  const clamped = Math.max(1, n)
  return ((Math.log10(clamped) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 100
}

const ticks = [1, 10, 100, 1_000, 10_000, 100_000, 1_000_000].map(n => ({
  n,
  pct: logPct(n),
  label: n >= 1_000_000 ? `${n / 1_000_000}M` : n >= 1_000 ? `${n / 1_000}k` : String(n),
}))

const showThen = ref(false)
const selectedId = ref<string | null>(null)

type Row = PopulationEntry & {
  barLeft: number
  barWidth: number
  estPct: number
  thenPct: number | null
  color: string
}

const visible = computed<Row[]>(() => {
  return withEstimate
    .filter((p) => {
      if (group.value !== 'all' && p.group !== group.value) return false
      if (status.value !== 'all' && p.iucnCode !== status.value) return false
      return true
    })
    .map((p) => {
      const lowPct = logPct(p.currentLow)
      const span = logPct(p.currentHigh) - lowPct
      const estPct = logPct(p.estimate)
      // Single-figure estimates still get a short bar, centred on the dot.
      const minSpan = 1.2
      return {
        ...p,
        barLeft: span < minSpan ? estPct - minSpan / 2 : lowPct,
        barWidth: Math.max(span, minSpan),
        estPct,
        thenPct: p.prewhalingApprox ? logPct(p.prewhalingApprox) : null,
        color: p.group === 'baleen' ? '#00f0ff' : '#ff3ec8',
      }
    })
    .sort((a, b) => b.estimate - a.estimate)
})

/** What a screen reader hears for a row; the bars themselves are decorative. */
function summarise(row: Row) {
  const range = row.currentLow !== row.currentHigh
    ? ` (estimates range from ${formatCount(row.currentLow)} to ${formatCount(row.currentHigh)})`
    : ''
  const then = showThen.value && row.prewhalingApprox
    ? ` Historical baseline about ${formatCount(row.prewhalingApprox)}.`
    : ''
  return `${row.name}, ${row.iucnStatus}. About ${formatCount(row.estimate)}${range}. `
    + `Trend: ${trendMeta[row.trend].label.toLowerCase()}.${then}`
}

watch([group, status], () => {
  if (selectedId.value && !visible.value.some(r => r.id === selectedId.value)) {
    selectedId.value = null
  }
})

function toggle(id: string) {
  selectedId.value = selectedId.value === id ? null : id
}

function reset() {
  group.value = 'all'
  status.value = 'all'
}

// Wipe the rows in once, the first time the chart scrolls into view. The prerendered
// page (and visitors who prefer reduced motion) get the finished chart straight away.
const chartEl = ref<HTMLElement | null>(null)
const revealed = ref(true)
onMounted(() => {
  const el = chartEl.value
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return
  revealed.value = false
  const { stop } = useIntersectionObserver(el, ([entry]) => {
    if (!entry?.isIntersecting) return
    revealed.value = true
    stop()
  }, { threshold: 0.05 })
})
</script>

<style scoped>
/* Negative insets leave room for the glow and the dot rings. */
.marks {
  clip-path: inset(-8px -16px -8px -16px);
  transition: clip-path 1s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms);
}
.marks-hidden {
  clip-path: inset(-8px calc(100% + 16px) -8px -16px);
}
@media (prefers-reduced-motion: reduce) {
  .marks {
    transition: none;
  }
}
</style>
