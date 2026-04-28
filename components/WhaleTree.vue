<template>
  <section id="classification" class="py-20 px-6 ocean-depth-mid scroll-mt-20">
    <div class="max-w-6xl mx-auto">
      <h2
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.8 } }"
        class="text-4xl md:text-5xl font-whale text-white mb-4 text-center"
      >
        Classification
      </h2>
      <p
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1 } }"
        class="text-lg text-white/80 mb-12 text-center max-w-3xl mx-auto"
      >
        Every living whale belongs to one of two branches: baleen filter-feeders and toothed
        predators. Expand a family to see what lives there.
      </p>

      <div class="space-y-8">
        <div
          v-for="(group, groupIndex) in whaleGroups"
          :key="group.scientificName"
          v-motion
          :initial="{ opacity: 0, x: -20 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 0.6, delay: groupIndex * 0.2 } }"
          class="card bg-base-100/10 backdrop-blur-sm border border-white/20 shadow-xl"
        >
          <div class="card-body">
            <h3 class="card-title text-2xl text-white mb-2">
              {{ group.name }}
              <span class="text-sm font-normal text-white/70">
                ({{ group.scientificName }})
              </span>
            </h3>
            <p class="text-white/80 mb-4">{{ group.description }}</p>

            <div class="grid md:grid-cols-2 gap-4 mt-4">
              <div
                v-for="family in group.families"
                :key="family.scientificName"
                class="collapse collapse-arrow bg-base-200/20 border border-white/10"
              >
                <input type="checkbox" :aria-label="`Expand ${family.name}`" />
                <div class="collapse-title text-white font-medium">
                  {{ family.name }}
                  <span class="text-sm font-normal text-white/60 ml-2">
                    {{ family.scientificName }} &middot; {{ family.species.length }} species
                  </span>
                </div>
                <div class="collapse-content">
                  <p class="text-white/70 mb-3">{{ family.description }}</p>
                  <ul class="list-disc list-inside space-y-1 text-white/80 text-sm">
                    <li v-for="name in family.species" :key="name">{{ name }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { whaleGroups } from '~/data/whaleTaxonomy'
</script>

<style scoped>
.ocean-depth-mid {
  background: linear-gradient(to bottom,
    rgba(70, 130, 180, 0.3) 0%,
    rgba(25, 25, 112, 0.4) 50%,
    rgba(0, 0, 139, 0.5) 100%
  );
}
</style>
