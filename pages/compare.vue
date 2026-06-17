<template>
  <div class="min-h-screen bg-base-100 py-16 px-6">
    <div class="max-w-5xl mx-auto">
      <div class="text-center mb-10">
        <h1 class="text-5xl md:text-6xl font-whale mb-4">Compare</h1>
        <p class="text-lg text-base-content/70 max-w-2xl mx-auto">
          Pick any two and see them side by side.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div v-for="(side, i) in [left, right]" :key="i">
          <select
            :value="i === 0 ? leftId : rightId"
            class="select select-bordered w-full mb-4"
            :aria-label="i === 0 ? 'First whale' : 'Second whale'"
            @change="onSelect(i, $event)"
          >
            <option v-for="s in species" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>

          <div v-if="side" class="card bg-base-200 border border-base-300 shadow-lg overflow-hidden h-full">
            <figure class="aspect-[16/10] overflow-hidden">
              <img :src="side.adult.image" :alt="side.name" class="w-full h-full object-cover" loading="lazy" decoding="async">
            </figure>
            <div class="card-body">
              <h2 class="card-title text-2xl">{{ side.name }}</h2>
              <p class="text-sm italic text-base-content/60 -mt-1">{{ side.scientificName }}</p>
              <div class="my-2"><StatusBadge :status="side.conservationStatus" /></div>
              <dl class="text-sm divide-y divide-base-300">
                <div v-for="row in attrs(side)" :key="row.label" class="flex justify-between gap-4 py-2">
                  <dt class="text-base-content/60 flex-shrink-0">{{ row.label }}</dt>
                  <dd class="text-right font-medium">{{ row.value }}</dd>
                </div>
              </dl>
              <NuxtLink :to="`/species/${side.id}`" class="btn btn-ghost btn-sm mt-2 self-start gap-1">
                Full profile
                <ArrowRightIcon class="h-4 w-4" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Combined size-to-scale -->
      <div v-if="left && right" class="card bg-base-200 border border-base-300 mt-8">
        <div class="card-body">
          <h3 class="text-lg font-semibold mb-4">Length to scale</h3>
          <div class="space-y-3">
            <div v-for="row in scaleRows" :key="row.label">
              <div class="flex items-center justify-between text-xs text-base-content/70 mb-1">
                <span>{{ row.label }}</span>
                <span class="tabular-nums">{{ row.meters }} m</span>
              </div>
              <div class="h-3.5 rounded-full bg-base-300 overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700" :style="{ width: row.pct + '%', background: row.color }" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import type { WhaleSpecies } from '~/types/species'
import { species } from '~/data/species'

defineOptions({ name: 'ComparePage' })

useSeoMeta({
  title: 'Compare whales, Whalesome',
  description: 'Put any two whales side by side: size, weight, conservation status, and habitat, drawn to the same scale.',
  ogTitle: 'Compare whales',
  ogDescription: 'Put any two whales side by side, drawn to the same scale.',
  twitterCard: 'summary_large_image',
})

const leftId = ref('blue-whale')
const rightId = ref('orca')

const left = computed(() => species.find(s => s.id === leftId.value) ?? null)
const right = computed(() => species.find(s => s.id === rightId.value) ?? null)

function onSelect(i: number, e: Event) {
  const id = (e.target as HTMLSelectElement).value
  if (i === 0) leftId.value = id
  else rightId.value = id
}

function attrs(s: WhaleSpecies) {
  return [
    { label: 'Group', value: `${s.group.charAt(0).toUpperCase()}${s.group.slice(1)} whale` },
    { label: 'Family', value: s.family },
    { label: 'Length', value: s.adult.size },
    { label: 'Weight', value: s.adult.weight },
    { label: 'Habitat', value: s.habitat },
  ]
}

function meters(size: string): number {
  const found = [...size.matchAll(/([\d.]+)\s*m\b/g)].map(m => parseFloat(m[1]))
  return found.length ? Math.max(...found) : 0
}

const scaleRows = computed(() => {
  if (!left.value || !right.value) return []
  const l = meters(left.value.adult.size)
  const r = meters(right.value.adult.size)
  const max = Math.max(l, r, 1.8)
  return [
    { label: left.value.name, meters: l, color: 'linear-gradient(to right, #00f0ff, #5b79ce)' },
    { label: right.value.name, meters: r, color: 'linear-gradient(to right, #ff3ec8, #9c4a6a)' },
    { label: 'Adult human', meters: 1.8, color: '#fbbf24' },
  ].map(row => ({ ...row, pct: Math.max(2, (row.meters / max) * 100) }))
})
</script>
