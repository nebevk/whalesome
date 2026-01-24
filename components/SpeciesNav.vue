<template>
  <aside class="w-full md:w-64 flex-shrink-0">
    <div class="sticky top-4">
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body p-4">
          <h3 class="card-title text-lg mb-4">Whale Species</h3>
          <ul class="menu menu-vertical w-full">
            <li v-for="species in speciesList" :key="species.id">
              <a
                :href="`#${species.id}`"
                @click.prevent="selectSpecies(species.id)"
                :class="{
                  'active': selectedSpeciesId === species.id,
                  'bg-primary text-primary-content': selectedSpeciesId === species.id
                }"
                class="rounded-lg"
              >
                {{ species.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { WhaleSpecies } from '~/types/species'

interface Props {
  speciesList: WhaleSpecies[]
  selectedSpeciesId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:selectedSpeciesId': [id: string]
}>()

const selectSpecies = (id: string) => {
  emit('update:selectedSpeciesId', id)
  // Scroll to species section
  if (process.client) {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}
</script>
