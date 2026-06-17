<template>
  <div class="min-h-screen bg-base-100 py-16 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-10">
        <h1 class="text-5xl md:text-6xl font-whale mb-4">Whale Species</h1>
        <p class="text-lg text-base-content/70 max-w-2xl mx-auto">
          {{ species.length }} profiles, split between baleen filter-feeders and toothed
          predators. Search, filter, or just browse.
        </p>
      </div>

      <!-- Filter + search controls -->
      <div class="card bg-base-200 border border-base-300 mb-10">
        <div class="card-body p-4 md:p-5 grid gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
          <label class="input input-bordered flex items-center gap-2">
            <MagnifyingGlassIcon class="h-5 w-5 opacity-60" />
            <input
              v-model="q"
              type="search"
              class="grow"
              placeholder="Search name, family, or habitat"
              aria-label="Search species"
            >
          </label>
          <select v-model="groupFilter" class="select select-bordered" aria-label="Filter by group">
            <option value="all">All groups</option>
            <option value="baleen">Baleen</option>
            <option value="toothed">Toothed</option>
          </select>
          <select v-model="statusFilter" class="select select-bordered" aria-label="Filter by status">
            <option value="all">All statuses</option>
            <option v-for="opt in statusOptions" :key="opt.code" :value="opt.code">{{ opt.label }}</option>
          </select>
          <button class="btn btn-ghost" :disabled="!isFiltered" @click="reset">Reset</button>
        </div>
      </div>

      <p class="text-sm text-base-content/60 mb-6">
        Showing {{ filtered.length }} of {{ species.length }} species.
      </p>

      <div v-if="!filtered.length" class="text-center py-16 text-base-content/60">
        <p class="text-lg">No whales match that.</p>
        <button class="btn btn-primary btn-sm mt-4" @click="reset">Clear filters</button>
      </div>

      <div v-for="group in groups" :key="group.label" class="mb-16">
        <div class="flex items-baseline justify-between mb-6 px-1">
          <h2 class="text-2xl font-whale">{{ group.label }}</h2>
          <span class="text-sm text-base-content/60">{{ group.items.length }} species</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="entry in group.items" :key="entry.id">
            <NuxtLink :to="`/species/${entry.id}`" class="group block h-full">
              <div class="card bg-base-200 border border-base-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden">
                <figure class="aspect-[4/3] overflow-hidden">
                  <img
                    :src="entry.adult.image"
                    :alt="entry.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  >
                </figure>
                <div class="card-body">
                  <h3 class="card-title">{{ entry.name }}</h3>
                  <p class="text-sm italic text-base-content/60">{{ entry.scientificName }}</p>
                  <p class="text-sm text-base-content/80 line-clamp-2">{{ entry.description }}</p>
                  <div class="card-actions justify-between items-center mt-2">
                    <StatusBadge :status="entry.conservationStatus" short />
                    <span class="text-primary text-sm flex items-center gap-1">
                      Read
                      <ArrowRightIcon class="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import type { IucnCode } from '~/types/species'
import { species } from '~/data/species'
import { iucnMeta, iucnFromStatus } from '~/data/iucn'

defineOptions({ name: 'SpeciesIndexPage' })

useSeoMeta({
  title: 'Whale Species, Whalesome',
  description: `Browse ${species.length} whale species profiles, from blue whales to vaquitas. Search and filter by group, conservation status, and habitat.`,
  ogTitle: 'Whale Species, Whalesome',
  ogDescription: `Browse ${species.length} whale species profiles, from blue whales to vaquitas.`,
  twitterCard: 'summary_large_image',
})

const q = ref('')
const groupFilter = ref<'all' | 'baleen' | 'toothed'>('all')
const statusFilter = ref<'all' | IucnCode>('all')

// Only offer status options that actually appear in the data.
const statusOptions = computed(() => {
  const present = new Set(species.map(s => iucnFromStatus(s.conservationStatus)))
  return (Object.keys(iucnMeta) as IucnCode[])
    .filter(code => present.has(code))
    .map(code => ({ code, label: iucnMeta[code].label }))
})

const isFiltered = computed(() => q.value !== '' || groupFilter.value !== 'all' || statusFilter.value !== 'all')

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  return species.filter((s) => {
    if (groupFilter.value !== 'all' && s.group !== groupFilter.value) return false
    if (statusFilter.value !== 'all' && iucnFromStatus(s.conservationStatus) !== statusFilter.value) return false
    if (term) {
      const haystack = `${s.name} ${s.scientificName} ${s.family} ${s.habitat}`.toLowerCase()
      if (!haystack.includes(term)) return false
    }
    return true
  })
})

const groups = computed(() => [
  { label: 'Baleen whales', items: filtered.value.filter(s => s.group === 'baleen') },
  { label: 'Toothed whales', items: filtered.value.filter(s => s.group === 'toothed') },
].filter(g => g.items.length))

function reset() {
  q.value = ''
  groupFilter.value = 'all'
  statusFilter.value = 'all'
}
</script>
