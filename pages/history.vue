<template>
  <div class="min-h-screen">
    <ReadingProgress />
    <section class="relative overflow-hidden px-6 pt-16 pb-16 text-center hist-hero">
      <div class="relative z-10 max-w-3xl mx-auto">
        <p class="uppercase tracking-[0.3em] text-primary/80 text-xs mb-4">A short history</p>
        <h1 class="text-4xl md:text-6xl font-whale text-white mb-4">The Age of Whaling</h1>
        <p class="text-lg text-white/80 mb-8">
          For a thousand years whales were hunted for oil, light, and baleen. In a single century the
          industry killed nearly three million of them, then, at the edge of collapse, much of the
          world agreed to stop. This is how it unfolded.
        </p>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
          <StatTile
            v-for="(stat, i) in heroStats"
            :key="stat.label"
            :value="stat.value"
            :label="stat.label"
            :class="i === heroStats.length - 1 ? 'col-span-2 sm:col-span-1' : ''"
          />
        </div>
      </div>
    </section>

    <div class="px-6 pb-24">
      <div class="max-w-3xl mx-auto">
        <!-- Era legend -->
        <div class="flex flex-wrap gap-x-5 gap-y-2 justify-center mb-12">
          <div v-for="era in whalingEras" :key="era.key" class="flex items-center gap-2 text-sm">
            <span class="h-3 w-3 rounded-full flex-shrink-0" :style="{ background: era.color }" />
            <span class="text-base-content/80">{{ era.label }}</span>
          </div>
        </div>

        <!-- Timeline -->
        <ol class="relative">
          <li
            v-for="(event, i) in timeline"
            :key="i"
            class="relative pl-10 pb-10 border-l-2 border-white/10 last:border-l-transparent"
          >
            <span
              class="absolute -left-[9px] top-1 h-4 w-4 rounded-full ring-4 ring-base-100"
              :style="{ background: eraColor(event.era) }"
            />
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm font-semibold tracking-wide text-primary tabular-nums">{{ event.year }}</span>
              <span
                class="text-[0.7rem] uppercase tracking-wide rounded px-2 py-0.5 border"
                :style="{ borderColor: eraColor(event.era), color: eraColor(event.era) }"
              >
                {{ eraLabel(event.era) }}
              </span>
            </div>
            <h3 class="text-lg md:text-xl font-semibold mt-1.5">{{ event.title }}</h3>
            <p class="text-base-content/75 mt-1.5 leading-relaxed">{{ event.description }}</p>
            <div class="flex flex-wrap items-center gap-3 mt-3">
              <span
                v-if="event.figure"
                class="badge badge-outline badge-sm"
                :style="{ borderColor: eraColor(event.era), color: eraColor(event.era) }"
              >
                {{ event.figure }}
              </span>
              <a
                :href="event.source"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs text-base-content/50 hover:text-primary inline-flex items-center gap-1"
              >
                Source
                <ArrowTopRightOnSquareIcon class="h-3 w-3" />
              </a>
            </div>
          </li>
        </ol>

        <PopulationScrubber class="mt-14" />

        <div class="mt-12 card bg-base-200/60 border border-white/10">
          <div class="card-body items-center text-center">
            <h2 class="text-2xl font-whale">Where the numbers stand now</h2>
            <p class="text-base-content/70 max-w-xl">
              The hunting has mostly stopped. Recovery has not been even, and new threats have taken
              the harpoon's place. See where each species sits today.
            </p>
            <NuxtLink to="/populations" class="btn btn-primary mt-2">
              Whales by the numbers
              <ArrowRightIcon class="h-5 w-5" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRightIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import type { WhalingEra } from '~/types/species'
import { whalingTimeline, whalingEras } from '~/data/whalingHistory'
import { stats } from '~/data/population'

defineOptions({ name: 'HistoryPage' })

// Hero figures reuse the /populations wording, so the two pages never disagree.
const heroStats = [
  stats.killed,
  { label: 'Commercial whaling moratorium takes effect', value: '1986' },
  stats.antarcticBlue,
]

useSeoMeta({
  title: 'The Age of Whaling, a timeline',
  description: 'From Basque shore stations to the 1986 moratorium: a sourced timeline of commercial whaling, the species it depleted, and the slow recovery since.',
  ogTitle: 'The Age of Whaling',
  ogDescription: 'A sourced timeline of commercial whaling and its aftermath.',
  twitterCard: 'summary_large_image',
})

const timeline = [...whalingTimeline].sort((a, b) => a.sortYear - b.sortYear)

const eraColor = (key: WhalingEra) => whalingEras.find(e => e.key === key)?.color ?? '#00f0ff'
const eraLabel = (key: WhalingEra) => whalingEras.find(e => e.key === key)?.label ?? key
</script>

<style scoped>
.hist-hero {
  background: linear-gradient(to bottom, #0a3a5c 0%, #082a45 60%, var(--color-base-100) 100%);
}
</style>
