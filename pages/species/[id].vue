<template>
  <div class="min-h-screen bg-base-100 py-8 px-6">
    <ReadingProgress />
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <NuxtLink to="/species" class="btn btn-ghost btn-sm gap-1">
          <ArrowLeftIcon class="h-4 w-4" />
          All species
        </NuxtLink>
      </div>

      <div class="flex flex-col md:flex-row gap-8">
        <SpeciesNav :species-list="species" :selected-species-id="route.params.id as string" />

        <div class="flex-1 min-w-0">
          <SpeciesDetail v-if="current" :species="current" />

          <div v-if="current" class="mt-10 flex items-stretch justify-between gap-4">
            <NuxtLink
              v-if="prev"
              :to="`/species/${prev.id}`"
              class="card bg-base-200 hover:bg-base-300 transition-colors flex-1 max-w-xs"
            >
              <div class="card-body p-4">
                <p class="text-xs text-base-content/60 flex items-center gap-1">
                  <ArrowLeftIcon class="h-3 w-3" />
                  Previous
                </p>
                <p class="font-semibold">{{ prev.name }}</p>
              </div>
            </NuxtLink>
            <div v-else class="flex-1 max-w-xs" />

            <NuxtLink
              v-if="next"
              :to="`/species/${next.id}`"
              class="card bg-base-200 hover:bg-base-300 transition-colors flex-1 max-w-xs text-right"
            >
              <div class="card-body p-4">
                <p class="text-xs text-base-content/60 flex items-center justify-end gap-1">
                  Next
                  <ArrowRightIcon class="h-3 w-3" />
                </p>
                <p class="font-semibold">{{ next.name }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'
import { species } from '~/data/species'

defineOptions({ name: 'SpeciesDetailPage' })

definePageMeta({
  validate: (route) => species.some(s => s.id === route.params.id),
})

const route = useRoute()

const current = computed(() => species.find(s => s.id === route.params.id))
const currentIndex = computed(() => species.findIndex(s => s.id === route.params.id))
const prev = computed(() => currentIndex.value > 0 ? species[currentIndex.value - 1] : null)
const next = computed(() => currentIndex.value >= 0 && currentIndex.value < species.length - 1 ? species[currentIndex.value + 1] : null)

if (current.value) {
  const c = current.value
  const shortDesc = c.description.length > 140 ? c.description.slice(0, 137) + '…' : c.description
  useSeoMeta({
    title: `${c.name}, Whalesome`,
    description: c.description,
    ogTitle: `${c.name} (${c.scientificName})`,
    ogDescription: c.description,
    twitterCard: 'summary_large_image',
  })
}
</script>
