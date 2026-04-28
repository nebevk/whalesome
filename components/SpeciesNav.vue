<template>
  <aside class="w-full md:w-64 flex-shrink-0">
    <div class="sticky top-20">
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body p-4">
          <div v-for="group in groups" :key="group.label">
            <h3 class="text-xs uppercase tracking-wide text-base-content/60 font-semibold px-3 mt-2 mb-1">
              {{ group.label }}
            </h3>
            <ul class="menu menu-vertical w-full mb-2">
              <li v-for="entry in group.items" :key="entry.id">
                <a
                  :href="`#${entry.id}`"
                  @click.prevent="selectSpecies(entry.id)"
                  :class="{
                    'bg-primary text-primary-content': selectedSpeciesId === entry.id,
                  }"
                  class="rounded-lg"
                >
                  {{ entry.name }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WhaleSpecies } from '~/types/species'

interface Props {
  speciesList: WhaleSpecies[]
  selectedSpeciesId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:selectedSpeciesId': [id: string]
}>()

const groups = computed(() => [
  {
    label: 'Baleen whales',
    items: props.speciesList.filter(s => s.group === 'baleen'),
  },
  {
    label: 'Toothed whales',
    items: props.speciesList.filter(s => s.group === 'toothed'),
  },
])

const selectSpecies = (id: string) => {
  emit('update:selectedSpeciesId', id)
  if (import.meta.client) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>
