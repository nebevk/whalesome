<template>
  <div class="min-h-screen bg-base-100 py-8 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h1
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 0.8 } }"
          class="text-5xl md:text-6xl font-whale mb-4"
        >
          Whale Species
        </h1>
        <p
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1 } }"
          class="text-lg text-base-content/70 max-w-2xl mx-auto"
        >
          Ten profiles covering both whale branches — the baleen filter-feeders and the toothed
          predators.
        </p>
      </div>

      <div class="flex flex-col md:flex-row gap-8">
        <SpeciesNav
          :species-list="species"
          :selected-species-id="selectedSpeciesId"
          @update:selected-species-id="selectedSpeciesId = $event"
        />

        <div class="flex-1">
          <SpeciesDetail v-if="selectedSpecies" :species="selectedSpecies" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { species } from '~/data/species'
import type { WhaleSpecies } from '~/types/species'

const selectedSpeciesId = ref<string>(species[0]?.id || '')

const selectedSpecies = computed<WhaleSpecies | null>(() => {
  return species.find(s => s.id === selectedSpeciesId.value) || null
})

onMounted(() => {
  if (!import.meta.client) return
  const hash = window.location.hash.slice(1)
  if (!hash) return
  const match = species.find(s => s.id === hash)
  if (!match) return
  selectedSpeciesId.value = match.id
  setTimeout(() => {
    document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 100)
})

watch(() => selectedSpeciesId.value, (newId) => {
  if (import.meta.client) {
    window.history.replaceState(null, '', `#${newId}`)
  }
})
</script>
