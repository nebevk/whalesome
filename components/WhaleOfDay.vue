<template>
  <section class="px-6 py-12">
    <div class="max-w-5xl mx-auto">
      <ClientOnly>
        <NuxtLink v-if="whale" :to="`/species/${whale.id}`" class="group block">
          <div
            class="card md:card-side bg-base-100/10 backdrop-blur-sm border border-white/15 shadow-xl overflow-hidden hover:border-primary/40 transition-colors"
          >
            <figure class="md:w-64 h-48 md:h-auto shrink-0">
              <img
                :src="whale.adult.image"
                :alt="whale.name"
                class="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              >
            </figure>
            <div class="card-body">
              <p class="text-xs uppercase tracking-[0.25em] text-primary/80">Whale of the day</p>
              <h3 class="text-2xl font-whale text-white">{{ whale.name }}</h3>
              <p class="text-white/70 text-sm italic">{{ whale.scientificName }}</p>
              <p class="text-white/80 text-sm line-clamp-2">{{ whale.description }}</p>
              <div class="mt-2 flex flex-wrap items-center gap-3">
                <StatusBadge :status="whale.conservationStatus" />
                <span class="text-primary text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read profile
                  <ArrowRightIcon class="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </NuxtLink>
        <template #fallback>
          <div class="h-48 rounded-2xl border border-white/10 bg-base-100/10 animate-pulse" />
        </template>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import { species } from '~/data/species'

// Deterministic by day of year, so it is stable through the day and changes at
// midnight. Evaluated only on the client (inside ClientOnly), so it stays safe
// for the static prerender.
const whale = computed(() => {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000)
  return species[dayOfYear % species.length]
})
</script>
