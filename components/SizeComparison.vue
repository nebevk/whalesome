<template>
  <div v-if="rows.length" class="rounded-xl border border-base-300 bg-base-200 p-5">
    <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-4">
      <h3 class="text-lg font-semibold">{{ versus ? 'Length to scale' : 'Size to scale' }}</h3>
      <span v-if="!versus" class="text-sm text-base-content/60">about {{ meters }} m long</span>
    </div>
    <p v-if="summary" class="-mt-2 mb-4 text-sm text-base-content/75">{{ summary }}</p>
    <div class="space-y-3">
      <div v-for="row in rows" :key="row.key">
        <div class="flex items-center justify-between gap-3 text-xs text-base-content/70 mb-1">
          <span class="inline-flex items-center gap-1.5">
            <component :is="row.icon" v-if="row.icon" class="h-4 w-4" />
            {{ row.label }}
          </span>
          <span class="tabular-nums">{{ row.meters }} m</span>
        </div>
        <div class="h-3.5 rounded-full bg-base-300 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-700"
            :style="{ width: row.pct + '%', background: row.color }"
          />
        </div>
      </div>
    </div>
    <p class="text-[0.7rem] text-base-content/45 mt-4">
      Lengths are approximate adult sizes. Bars are drawn to the same scale.
    </p>
  </div>
</template>

<script setup lang="ts">
import { UserIcon, TruckIcon } from '@heroicons/vue/24/outline'

interface Whale { name: string; size: string }

const props = defineProps<{
  name: string
  size: string
  /** A second whale drawn on the same scale, as on /compare. */
  versus?: Whale
}>()

/** Largest "<number> m" figure in a size string is the representative length. */
function lengthOf(size: string): number | null {
  const found = [...size.matchAll(/([\d.]+)\s*m\b/g)].map(m => parseFloat(m[1]))
  return found.length ? Math.max(...found) : null
}

const meters = computed(() => lengthOf(props.size))
const versusMeters = computed(() => (props.versus ? lengthOf(props.versus.size) : null))

interface Row { key: string; label: string; meters: number; icon: unknown; color: string }

const rows = computed(() => {
  const L = meters.value
  if (!L) return []
  const whales: Row[] = [
    { key: 'a', label: props.name, meters: L, icon: null, color: 'linear-gradient(to right, #00f0ff, #5b79ce)' },
  ]
  if (props.versus && versusMeters.value) {
    whales.push({ key: 'b', label: props.versus.name, meters: versusMeters.value, icon: null, color: 'linear-gradient(to right, #ff3ec8, #9c4a6a)' })
  }
  const longest = Math.max(...whales.map(w => w.meters))
  const refs: Row[] = [...whales]
  if (longest >= 14) refs.push({ key: 'bus', label: 'School bus', meters: 12, icon: TruckIcon, color: '#fb7185' })
  refs.push({ key: 'human', label: 'Adult human', meters: 1.8, icon: UserIcon, color: '#fbbf24' })
  // Scale to the longest bar, so a whale shorter than a person still fits.
  const max = Math.max(longest, 1.8)
  return refs.map(r => ({ ...r, pct: Math.max(2, (r.meters / max) * 100) }))
})

/** "The Blue Whale is about 20 times the length of the Vaquita." Only when comparing two. */
const summary = computed(() => {
  const a = meters.value
  const b = versusMeters.value
  if (!props.versus || !a || !b || props.versus.name === props.name) return ''
  const [long, short] = a >= b
    ? [{ name: props.name, m: a }, { name: props.versus.name, m: b }]
    : [{ name: props.versus.name, m: b }, { name: props.name, m: a }]
  const ratio = long.m / short.m
  if (ratio < 1.1) return `The ${long.name} and the ${short.name} are about the same length.`
  const rounded = ratio < 3 ? Math.round(ratio * 10) / 10 : Math.round(ratio)
  const times = rounded === 2 ? 'twice' : `${rounded} times`
  return `The ${long.name} is about ${times} the length of the ${short.name}.`
})
</script>
