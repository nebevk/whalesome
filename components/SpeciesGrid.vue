<template>
  <section class="py-20 px-6 ocean-depth-deep">
    <div class="max-w-7xl mx-auto">
      <h2
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.8 } }"
        class="text-4xl md:text-5xl font-whale text-white mb-4 text-center"
      >
        Featured Species
      </h2>
      <p
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1 } }"
        class="text-lg text-white/80 mb-12 text-center max-w-3xl mx-auto"
      >
        Four whales worth starting with. Each links to a fuller profile with adult and calf detail.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(entry, index) in featuredSpecies"
          :key="entry.id"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.1 } }"
        >
          <NuxtLink :to="`/species#${entry.id}`" class="block h-full">
            <div class="card bg-base-100/10 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 h-full">
              <figure class="px-6 pt-6">
                <img
                  :src="entry.adult.image"
                  :alt="entry.name"
                  class="w-full h-48 object-cover rounded-lg"
                  loading="lazy"
                />
              </figure>
              <div class="card-body">
                <h3 class="card-title text-white text-xl">{{ entry.name }}</h3>
                <p class="text-white/70 text-sm italic mb-2">{{ entry.scientificName }}</p>
                <p class="text-white/80 text-sm line-clamp-3">{{ entry.description }}</p>
                <div class="card-actions justify-end mt-4">
                  <span class="badge badge-primary badge-outline">{{ entry.conservationStatus }}</span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <div class="mt-12 text-center">
        <NuxtLink to="/species" class="btn btn-primary btn-lg">
          View all {{ species.length }} species
          <ArrowRightIcon class="h-5 w-5" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import { species, featuredSpecies } from '~/data/species'
</script>

<style scoped>
.ocean-depth-deep {
  background: linear-gradient(to bottom,
    rgba(25, 25, 112, 0.5) 0%,
    rgba(0, 0, 139, 0.6) 50%,
    rgba(0, 0, 50, 0.7) 100%
  );
}
</style>
