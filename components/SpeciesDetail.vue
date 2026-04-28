<template>
  <div v-if="species" :id="species.id" class="scroll-mt-20">
    <div class="card bg-base-100 shadow-xl mb-8">
      <div class="card-body">
        <div class="flex flex-wrap items-baseline gap-3 mb-2">
          <h2 class="card-title text-3xl">{{ species.name }}</h2>
          <span class="badge badge-primary badge-lg">{{ species.conservationStatus }}</span>
          <span class="badge badge-outline capitalize">{{ species.group }} whale</span>
        </div>
        <p class="text-base-content/70 italic text-lg mb-4">
          {{ species.scientificName }}
          <span class="text-base-content/50 not-italic"> &middot; Family {{ species.family }}</span>
        </p>
        <p class="text-base-content/80 text-lg mb-6">{{ species.description }}</p>

        <div class="diff aspect-[16/9] mb-6">
          <div class="diff-item-1">
            <div class="relative flex flex-col items-center justify-end h-full min-h-[200px]">
              <img
                :src="species.adult.image"
                :alt="`Adult ${species.name}`"
                class="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div class="relative z-10 w-full bg-base-300/90 backdrop-blur-sm p-4 text-left">
                <h3 class="text-lg font-bold mb-2">Adult</h3>
                <p class="text-sm"><strong>Size:</strong> {{ species.adult.size }}</p>
                <p class="text-sm"><strong>Weight:</strong> {{ species.adult.weight }}</p>
              </div>
            </div>
          </div>
          <div class="diff-item-2">
            <div class="relative flex flex-col items-center justify-end h-full min-h-[200px]">
              <img
                :src="species.baby.image"
                :alt="`Calf ${species.name}`"
                class="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div class="relative z-10 w-full bg-base-300/90 backdrop-blur-sm p-4 text-left">
                <h3 class="text-lg font-bold mb-2">Calf</h3>
                <p class="text-sm"><strong>Size:</strong> {{ species.baby.size }}</p>
                <p class="text-sm"><strong>Weight:</strong> {{ species.baby.weight }}</p>
              </div>
            </div>
          </div>
          <div class="diff-resizer"></div>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="card bg-base-200">
            <div class="card-body">
              <h3 class="card-title text-xl mb-4">Adult</h3>
              <ul class="list-disc list-inside space-y-2 mb-4">
                <li v-for="char in species.adult.characteristics" :key="char">{{ char }}</li>
              </ul>
              <div class="divider my-2">Notable facts</div>
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li v-for="fact in species.adult.facts" :key="fact">{{ fact }}</li>
              </ul>
            </div>
          </div>

          <div class="card bg-base-200">
            <div class="card-body">
              <h3 class="card-title text-xl mb-4">Calf</h3>
              <ul class="list-disc list-inside space-y-2 mb-4">
                <li v-for="char in species.baby.characteristics" :key="char">{{ char }}</li>
              </ul>
              <div class="divider my-2">Notable facts</div>
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li v-for="fact in species.baby.facts" :key="fact">{{ fact }}</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="mt-6 grid md:grid-cols-2 gap-4">
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-title">Habitat</div>
            <div class="stat-value text-lg">{{ species.habitat }}</div>
          </div>
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-title">Conservation</div>
            <div class="stat-value text-lg">{{ species.conservationStatus }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WhaleSpecies } from '~/types/species'

interface Props {
  species: WhaleSpecies | null
}

defineProps<Props>()
</script>
