<template>
  <div v-if="meters" class="rounded-xl border border-base-300 bg-base-200 p-5">
    <div class="flex items-baseline justify-between mb-4">
      <h3 class="text-lg font-semibold">Size to scale</h3>
      <span class="text-sm text-base-content/60">about {{ meters }} m long</span>
    </div>
    <div class="space-y-3">
      <div v-for="row in rows" :key="row.label">
        <div class="flex items-center justify-between text-xs text-base-content/70 mb-1">
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

const props = defineProps<{ name: string; size: string }>()

// Largest "<number> m" figure in the size string is the representative length.
const meters = computed(() => {
  const found = [...props.size.matchAll(/([\d.]+)\s*m\b/g)].map(m => parseFloat(m[1]))
  return found.length ? Math.max(...found) : null
})

interface Row { label: string; meters: number; icon: unknown; color: string }

const rows = computed(() => {
  const L = meters.value
  if (!L) return []
  const refs: Row[] = [
    { label: props.name, meters: L, icon: null, color: 'linear-gradient(to right, #00f0ff, #5b79ce)' },
  ]
  if (L >= 14) refs.push({ label: 'School bus', meters: 12, icon: TruckIcon, color: '#fb7185' })
  refs.push({ label: 'Adult human', meters: 1.8, icon: UserIcon, color: '#fbbf24' })
  return refs.map(r => ({ ...r, pct: Math.max(2, (r.meters / L) * 100) }))
})
</script>
