<template>
  <div class="min-h-screen">
    <section class="relative overflow-hidden px-6 pt-16 pb-14 pop-hero">
      <div class="relative z-10 max-w-3xl mx-auto text-center">
        <p class="uppercase tracking-[0.3em] text-primary/80 text-xs mb-4">By the numbers</p>
        <h1 class="text-4xl md:text-6xl font-whale text-white mb-4">Whales by the Numbers</h1>
        <p class="text-lg text-white/80">
          How far they fell, where they stand today, and how many are left. Figures drawn from the
          IUCN Red List, NOAA Fisheries, the International Whaling Commission, and the
          peer-reviewed literature.
        </p>
      </div>

      <!-- The hook: four figures, each with the story behind it. -->
      <div class="relative z-10 max-w-4xl mx-auto mt-10">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatTile
            v-for="stat in headlineStats"
            :key="stat.label"
            :value="stat.value"
            :label="stat.label"
            interactive
            :pressed="openHeadline === stat.label"
            controls="headline-story"
            @click="openHeadline = openHeadline === stat.label ? null : stat.label"
          />
        </div>
        <p class="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/70">
          <CursorArrowRaysIcon class="h-4 w-4" />
          Select a figure for the story behind it.
        </p>
        <div id="headline-story" class="mt-3" aria-live="polite">
          <div
            v-if="openHeadlineStat"
            class="mx-auto max-w-2xl rounded-2xl border border-primary/20 bg-base-200/40 px-5 py-4 backdrop-blur-sm"
          >
            <div :key="openHeadlineStat.label" class="story-in">
              <p class="text-[0.7rem] uppercase tracking-[0.2em] text-primary/80">{{ openHeadlineStat.label }}</p>
              <p class="mt-1.5 text-sm leading-relaxed text-white/80">{{ openHeadlineStat.detail }}</p>
              <p class="mt-2 text-[0.7rem] text-white/60">Source: {{ openHeadlineStat.source }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="px-6 pt-2 pb-24">
      <div class="max-w-6xl mx-auto space-y-14">
        <!-- Then: how far each species fell, and how it unfolded decade by decade. -->
        <PopulationRecovery />

        <PopulationScrubber />

        <!-- Now: where they stand, and how many are left. The status ring filters the
             abundance chart, so the two stay side by side. -->
        <PopulationStatus v-model:status="statusFilter" />

        <PopulationAbundance v-model:group="groupFilter" v-model:status="statusFilter" />

        <!-- Records of the living: lighter trivia, kept compact near the end. -->
        <section aria-labelledby="records-heading">
          <div class="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h2 id="records-heading" class="text-sm uppercase tracking-[0.2em] text-base-content/60">
              Records of the living
            </h2>
            <p class="flex items-center gap-1.5 text-xs text-base-content/60">
              <CursorArrowRaysIcon class="h-4 w-4" />
              Select a record for the story behind it.
            </p>
          </div>
          <div class="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <StatTile
              v-for="(stat, i) in recordStats"
              :key="stat.label"
              :value="stat.value"
              :label="stat.label"
              size="sm"
              interactive
              :pressed="openRecord === stat.label"
              controls="record-story"
              :class="i === recordStats.length - 1 && recordStats.length % 2 === 1 ? 'col-span-2 lg:col-span-1' : ''"
              @click="openRecord = openRecord === stat.label ? null : stat.label"
            />
          </div>
          <div id="record-story" class="mt-3" aria-live="polite">
            <div v-if="openRecordStat" class="rounded-2xl border border-white/10 bg-base-300/40 px-5 py-4">
              <div :key="openRecordStat.label" class="story-in">
                <p class="text-[0.7rem] uppercase tracking-[0.2em] text-primary/80">{{ openRecordStat.label }}</p>
                <p class="mt-1.5 text-sm leading-relaxed text-base-content/75">{{ openRecordStat.detail }}</p>
                <p class="mt-2 text-[0.7rem] text-base-content/55">Source: {{ openRecordStat.source }}</p>
              </div>
            </div>
          </div>
        </section>

        <div class="text-center">
          <NuxtLink to="/history" class="btn btn-primary btn-lg">
            See how it happened
            <ArrowRightIcon class="h-5 w-5" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRightIcon, CursorArrowRaysIcon } from '@heroicons/vue/24/outline'
import type { IucnCode } from '~/types/species'
import { headlineStats, recordStats } from '~/data/population'

defineOptions({ name: 'PopulationsPage' })

useSeoMeta({
  title: 'Whales by the Numbers, population data and recovery',
  description: 'Current global population estimates for 22 whale, dolphin, and porpoise species, how far each fell to whaling, and where they stand on the IUCN Red List.',
  ogTitle: 'Whales by the Numbers',
  ogDescription: 'Population estimates, depletion, and recovery for 22 cetacean species.',
  twitterCard: 'summary_large_image',
})

// One story open at a time per row of tiles; the first headline starts open so the
// pattern explains itself.
const openHeadline = ref<string | null>(headlineStats[0]?.label ?? null)
const openHeadlineStat = computed(() => headlineStats.find(s => s.label === openHeadline.value) ?? null)
const openRecord = ref<string | null>(null)
const openRecordStat = computed(() => recordStats.find(s => s.label === openRecord.value) ?? null)

const groupFilter = ref<'all' | 'baleen' | 'toothed'>('all')
const statusFilter = ref<'all' | IucnCode>('all')
</script>

<style scoped>
.pop-hero {
  background:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0, 240, 255, 0.12), transparent 55%),
    linear-gradient(to bottom, #0a3a5c 0%, #082a45 55%, var(--color-base-100) 100%);
}

/* Swapping stories replaces the text in place (no collapse and regrow), then fades it in. */
.story-in {
  animation: story-in 0.22s ease-out;
}
@keyframes story-in {
  from {
    opacity: 0;
    transform: translateY(3px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .story-in {
    animation: none;
  }
}
</style>
