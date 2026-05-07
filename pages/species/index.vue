<template>
  <div class="min-h-screen bg-base-100 py-16 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-whale mb-4">Whale Species</h1>
        <p class="text-lg text-base-content/70 max-w-2xl mx-auto">
          {{ species.length }} profiles, split between baleen filter-feeders and toothed
          predators. Pick one to read more.
        </p>
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
                  />
                </figure>
                <div class="card-body">
                  <h3 class="card-title">{{ entry.name }}</h3>
                  <p class="text-sm italic text-base-content/60">{{ entry.scientificName }}</p>
                  <p class="text-sm text-base-content/80 line-clamp-2">{{ entry.description }}</p>
                  <div class="card-actions justify-between items-center mt-2">
                    <span class="badge badge-outline badge-sm">{{ entry.conservationStatus.split(' (')[0] }}</span>
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
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import { species } from '~/data/species'

defineOptions({ name: 'SpeciesIndexPage' })

useSeoMeta({
  title: 'Whale Species — Whalesome',
  description: `Browse ${species.length} whale species profiles, from blue whales to bowheads. Adult and calf detail, conservation status, and gallery photography.`,
  ogTitle: 'Whale Species — Whalesome',
  ogDescription: `Browse ${species.length} whale species profiles, from blue whales to bowheads.`,
  twitterCard: 'summary_large_image',
})

// defineOgImage temporarily removed while bisecting hydration bug

const groups = computed(() => [
  { label: 'Baleen whales', items: species.filter(s => s.group === 'baleen') },
  { label: 'Toothed whales', items: species.filter(s => s.group === 'toothed') },
])
</script>
