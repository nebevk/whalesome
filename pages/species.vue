<template>
  <div class="min-h-screen bg-base-100 py-8 px-6">
    <div class="max-w-7xl mx-auto">
      <h1 
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.8 } }"
        class="text-5xl md:text-6xl font-whale text-center mb-12"
      >
        Whale Species
      </h1>

      <div class="flex flex-col md:flex-row gap-8">
        <!-- Left Sidebar Navigation -->
        <SpeciesNav 
          :species-list="featuredSpecies"
          :selected-species-id="selectedSpeciesId"
          @update:selected-species-id="selectedSpeciesId = $event"
        />

        <!-- Right Side Content -->
        <div class="flex-1">
          <div v-if="!selectedSpecies">
            <div class="card bg-base-200 shadow-xl">
              <div class="card-body text-center py-20">
                <div class="text-6xl mb-4">🐋</div>
                <h2 class="text-2xl mb-4">Select a Whale Species</h2>
                <p class="text-base-content/70">
                  Choose a species from the navigation menu to learn more about these magnificent creatures.
                </p>
              </div>
            </div>
          </div>
          <div v-else>
            <SpeciesDetail :species="selectedSpecies" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { featuredSpecies } from '~/data/species'
import type { WhaleSpecies } from '~/types/species'

const selectedSpeciesId = ref<string>(featuredSpecies[0]?.id || '')

const selectedSpecies = computed<WhaleSpecies | null>(() => {
  return featuredSpecies.find(s => s.id === selectedSpeciesId.value) || null
})

// Handle hash navigation on mount
onMounted(() => {
  if (process.client) {
    const hash = window.location.hash.slice(1)
    if (hash) {
      const species = featuredSpecies.find(s => s.id === hash)
      if (species) {
        selectedSpeciesId.value = species.id
        // Scroll to element after a brief delay
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      }
    }
  }
})

// Watch for hash changes
watch(() => selectedSpeciesId.value, (newId) => {
  if (process.client) {
    window.history.replaceState(null, '', `#${newId}`)
  }
})
</script>
