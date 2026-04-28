<template>
  <section class="relative py-20 px-6 ocean-depth-deepest overflow-hidden">
    <img
      :src="unsplash.ocean"
      alt=""
      class="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
      aria-hidden="true"
    />
    <div class="relative z-10 max-w-6xl mx-auto">
      <h2
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.8 } }"
        class="text-4xl md:text-5xl font-whale text-white mb-4 text-center"
      >
        Conservation &amp; Action
      </h2>
      <p
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1 } }"
        class="text-lg text-white/80 mb-12 text-center max-w-3xl mx-auto"
      >
        Whales face a short list of large problems: warming seas, plastic, ship strikes,
        entanglement in fishing gear, and noise. Small habits and steady giving add up.
      </p>

      <div class="grid md:grid-cols-2 gap-8 mb-12">
        <div
          v-motion
          :initial="{ opacity: 0, x: -20 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 0.6 } }"
          class="card bg-base-100/10 backdrop-blur-sm border border-white/20 shadow-xl"
        >
          <div class="card-body">
            <h3 class="card-title text-2xl text-white mb-4">What Actually Helps</h3>
            <ul class="space-y-3 text-white/80">
              <li class="flex gap-3">
                <CheckCircleIcon class="h-6 w-6 flex-shrink-0 text-primary" />
                <span>Cut single-use plastics where you can — straws and bags end up where the whales are.</span>
              </li>
              <li class="flex gap-3">
                <CheckCircleIcon class="h-6 w-6 flex-shrink-0 text-primary" />
                <span>Choose seafood certified by programs like MSC, or simply eat less of it.</span>
              </li>
              <li class="flex gap-3">
                <CheckCircleIcon class="h-6 w-6 flex-shrink-0 text-primary" />
                <span>Pick whale-watching operators that follow distance and engine-speed rules.</span>
              </li>
              <li class="flex gap-3">
                <CheckCircleIcon class="h-6 w-6 flex-shrink-0 text-primary" />
                <span>Support marine protected areas — they're the single biggest lever we have.</span>
              </li>
              <li class="flex gap-3">
                <CheckCircleIcon class="h-6 w-6 flex-shrink-0 text-primary" />
                <span>Donate, even a little, to the groups below. Small recurring gifts beat one-off bursts.</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          v-motion
          :initial="{ opacity: 0, x: 20 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 0.6 } }"
          class="card bg-base-100/10 backdrop-blur-sm border border-white/20 shadow-xl"
        >
          <div class="card-body">
            <h3 class="card-title text-2xl text-white mb-4">Organizations Doing the Work</h3>
            <div class="space-y-4">
              <div
                v-for="org in organizations"
                :key="org.name"
                class="border-b border-white/10 pb-3 last:border-0"
              >
                <h4 class="text-white font-semibold mb-1">{{ org.name }}</h4>
                <p class="text-white/70 text-sm mb-2">{{ org.description }}</p>
                <a
                  :href="org.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-primary hover:underline text-sm"
                >
                  Visit site
                  <ArrowTopRightOnSquareIcon class="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.3 } }"
        class="card bg-base-100/10 backdrop-blur-sm border border-white/20 shadow-xl"
      >
        <div class="card-body">
          <h3 class="card-title text-2xl text-white mb-2">Follow &amp; Learn</h3>
          <p class="text-white/80 mb-6">
            Researchers, photographers, and institutions worth following if whales have pulled you in.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              v-for="account in socialAccounts"
              :key="account.name"
              :href="account.url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-start gap-4 p-4 rounded-lg bg-base-100/10 border border-white/10 hover:bg-base-100/20 transition-colors"
            >
              <UserCircleIcon class="h-10 w-10 flex-shrink-0 text-primary" />
              <div>
                <h4 class="text-white font-semibold">{{ account.name }}</h4>
                <p class="text-white/60 text-sm">{{ account.handle }}</p>
                <p class="text-white/70 text-xs mt-1">{{ account.blurb }}</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  UserCircleIcon,
} from '@heroicons/vue/24/outline'
import { unsplash } from '~/data/unsplash'

const organizations = [
  {
    name: 'Whale and Dolphin Conservation',
    description: 'Policy advocacy, rescue, and research across every ocean basin.',
    url: 'https://uk.whales.org/',
  },
  {
    name: 'Ocean Conservancy',
    description: 'Long-running work on plastic pollution, sustainable fisheries, and Arctic policy.',
    url: 'https://oceanconservancy.org/',
  },
  {
    name: 'Sea Shepherd Conservation Society',
    description: 'Direct-action campaigns against illegal whaling and bycatch worldwide.',
    url: 'https://www.seashepherd.org/',
  },
  {
    name: 'International Whaling Commission',
    description: 'Intergovernmental body that sets whaling rules and funds conservation science.',
    url: 'https://iwc.int/',
  },
  {
    name: 'Cetacean Society International',
    description: 'Grants and volunteer work supporting small-scale cetacean research.',
    url: 'https://csiwhalesalive.org/',
  },
  {
    name: 'Oceana',
    description: 'Campaign-driven ocean advocacy focused on measurable policy wins.',
    url: 'https://oceana.org/',
  },
]

const socialAccounts = [
  {
    name: 'WDC Whales',
    handle: '@whalesorg',
    blurb: 'News and campaigns from Whale and Dolphin Conservation.',
    url: 'https://www.instagram.com/whalesorg/',
  },
  {
    name: 'NOAA Fisheries',
    handle: '@noaafisheries',
    blurb: 'US agency tracking whale populations, strandings, and policy.',
    url: 'https://www.instagram.com/noaafisheries/',
  },
  {
    name: 'Ocean Alliance',
    handle: '@oceanalliance',
    blurb: 'Drone-based research into whale health and behavior.',
    url: 'https://www.instagram.com/oceanalliance/',
  },
  {
    name: 'Paul Nicklen',
    handle: '@paulnicklen',
    blurb: 'National Geographic photographer documenting cold-water species.',
    url: 'https://www.instagram.com/paulnicklen/',
  },
]
</script>

<style scoped>
.ocean-depth-deepest {
  background: linear-gradient(to bottom,
    rgba(0, 0, 139, 0.6) 0%,
    rgba(0, 0, 50, 0.7) 50%,
    rgba(0, 0, 20, 0.8) 100%
  );
}
</style>
