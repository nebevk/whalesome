<template>
  <div v-if="species" :id="species.id" class="scroll-mt-20">
    <div class="card bg-base-100 shadow-xl mb-8">
      <div class="card-body">
        <h2 class="card-title text-3xl mb-2">
          {{ species.name }}
          <span class="badge badge-primary badge-lg">{{ species.conservationStatus }}</span>
        </h2>
        <p class="text-base-content/70 italic text-lg mb-4">{{ species.scientificName }}</p>
        <p class="text-base-content/80 text-lg mb-6">{{ species.description }}</p>

        <!-- DaisyUI Diff Component for Adult vs Baby -->
        <div class="diff aspect-[16/9] mb-6">
          <div class="diff-item-1">
            <div class="bg-gradient-to-br from-blue-400/30 to-blue-900/50 flex items-center justify-center h-full">
              <div class="text-center p-8">
                <div class="text-6xl mb-4">🐋</div>
                <h3 class="text-2xl font-bold mb-4">Adult {{ species.name }}</h3>
                <div class="space-y-2 text-left">
                  <p><strong>Size:</strong> {{ species.adult.size }}</p>
                  <p><strong>Weight:</strong> {{ species.adult.weight }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="diff-item-2">
            <div class="bg-gradient-to-br from-pink-400/30 to-purple-900/50 flex items-center justify-center h-full">
              <div class="text-center p-8">
                <div class="text-6xl mb-4">🐋</div>
                <h3 class="text-2xl font-bold mb-4">Baby {{ species.name }}</h3>
                <div class="space-y-2 text-left">
                  <p><strong>Size:</strong> {{ species.baby.size }}</p>
                  <p><strong>Weight:</strong> {{ species.baby.weight }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Information Grid -->
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Adult Characteristics -->
          <div class="card bg-base-200">
            <div class="card-body">
              <h3 class="card-title text-xl mb-4">Adult Characteristics</h3>
              <ul class="list-disc list-inside space-y-2 mb-4">
                <li v-for="char in species.adult.characteristics" :key="char">{{ char }}</li>
              </ul>
              <div class="divider"></div>
              <h4 class="font-semibold mb-2">Interesting Facts</h4>
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li v-for="fact in species.adult.facts" :key="fact">{{ fact }}</li>
              </ul>
            </div>
          </div>

          <!-- Baby Characteristics -->
          <div class="card bg-base-200">
            <div class="card-body">
              <h3 class="card-title text-xl mb-4">Baby Characteristics</h3>
              <ul class="list-disc list-inside space-y-2 mb-4">
                <li v-for="char in species.baby.characteristics" :key="char">{{ char }}</li>
              </ul>
              <div class="divider"></div>
              <h4 class="font-semibold mb-2">Interesting Facts</h4>
              <ul class="list-disc list-inside space-y-1 text-sm">
                <li v-for="fact in species.baby.facts" :key="fact">{{ fact }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="mt-6 grid md:grid-cols-2 gap-4">
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-title">Habitat</div>
            <div class="stat-value text-lg">{{ species.habitat }}</div>
          </div>
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-title">Group</div>
            <div class="stat-value text-lg capitalize">{{ species.group }} Whale</div>
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
