<template>
  <section id="conservation" class="relative py-20 px-6 overflow-hidden scroll-mt-20">
    <div class="relative z-10 max-w-6xl mx-auto">
      <h2
        class="text-4xl md:text-5xl font-whale text-white mb-4 text-center"
      >
        Conservation &amp; Action
      </h2>
      <p
        class="text-lg text-white/80 mb-12 text-center max-w-3xl mx-auto"
      >
        Whales face a short list of large problems: warming seas, plastic, ship strikes,
        entanglement in fishing gear, and noise. Small habits and steady giving add up.
      </p>

      <!-- Two cards of about the same height side by side, then the organisations
           across the full width. Nothing has to stretch to match a taller neighbour. -->
      <div class="grid gap-8 lg:grid-cols-12 mb-8">
        <div
          class="card bg-base-100/10 backdrop-blur-sm border border-white/20 shadow-xl lg:col-span-5"
        >
          <div class="card-body">
            <h3 class="card-title text-2xl text-white mb-4">What Actually Helps</h3>
            <ul class="space-y-3 text-white/80">
              <li v-for="tip in tips" :key="tip" class="flex gap-3">
                <CheckCircleIcon class="h-6 w-6 flex-shrink-0 text-primary" aria-hidden="true" />
                <span>{{ tip }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          class="card bg-base-100/10 backdrop-blur-sm border border-white/20 shadow-xl lg:col-span-7"
        >
          <div class="card-body">
            <h3 class="card-title text-2xl text-white">Follow &amp; Learn</h3>
            <p class="grow-0 text-white/80 mb-4">
              Researchers, photographers, and institutions worth following if whales have pulled you in.
            </p>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3" role="list">
              <li v-for="account in socialAccounts" :key="account.name">
                <a
                  :href="account.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group/acct flex h-full items-start gap-3 rounded-xl border border-white/10 bg-base-100/15 p-4 transition-colors hover:border-primary/50 hover:bg-base-100/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span
                    class="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-primary/10 text-primary ring-1 ring-inset ring-primary/30"
                    aria-hidden="true"
                  >
                    <component :is="account.icon" class="h-5 w-5" />
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="flex items-start justify-between gap-2">
                      <span class="font-semibold leading-snug text-white group-hover/acct:underline underline-offset-2">{{ account.name }}</span>
                      <ArrowTopRightOnSquareIcon
                        class="mt-0.5 h-4 w-4 flex-shrink-0 text-white/50 transition-colors group-hover/acct:text-primary"
                        aria-hidden="true"
                      />
                    </span>
                    <span class="block text-sm text-primary">
                      {{ account.handle }}<span class="text-white/60"> on {{ account.platform }}</span>
                    </span>
                    <span class="mt-1 block text-xs leading-relaxed text-white/70">{{ account.blurb }}</span>
                    <span class="sr-only">(opens in a new tab)</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        class="card bg-base-100/10 backdrop-blur-sm border border-white/20 shadow-xl"
      >
        <div class="card-body">
          <h3 class="card-title text-2xl text-white mb-2">Organizations Doing the Work</h3>
          <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6" role="list">
            <li
              v-for="org in organizations"
              :key="org.name"
              class="flex flex-col border-t border-white/10 pt-4"
            >
              <h4 class="text-white font-semibold mb-1">{{ org.name }}</h4>
              <p class="text-white/70 text-sm mb-3">{{ org.description }}</p>
              <a
                :href="org.url"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-auto inline-flex w-fit items-center gap-1 text-primary hover:underline text-sm"
              >
                Visit site<span class="sr-only">: {{ org.name }} (opens in a new tab)</span>
                <ArrowTopRightOnSquareIcon class="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  MegaphoneIcon,
  BuildingLibraryIcon,
  BeakerIcon,
  CameraIcon,
} from '@heroicons/vue/24/outline'

const tips = [
  'Cut single-use plastics where you can. Straws and bags end up where the whales are.',
  'Choose seafood certified by programs like MSC, or simply eat less of it.',
  'Pick whale-watching operators that follow distance and engine-speed rules.',
  'Support marine protected areas, the single biggest lever we have.',
  'Donate, even a little, to the groups below. Small recurring gifts beat one-off bursts.',
]

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

// Each account gets an icon for what it is (campaign group, agency, lab,
// photographer) rather than one generic avatar repeated four times.
const socialAccounts = [
  {
    name: 'WDC Whales',
    handle: '@whalesorg',
    platform: 'Instagram',
    blurb: 'News and campaigns from Whale and Dolphin Conservation.',
    url: 'https://www.instagram.com/whalesorg/',
    icon: MegaphoneIcon,
  },
  {
    name: 'NOAA Fisheries',
    handle: '@noaafisheries',
    platform: 'Instagram',
    blurb: 'US agency tracking whale populations, strandings, and policy.',
    url: 'https://www.instagram.com/noaafisheries/',
    icon: BuildingLibraryIcon,
  },
  {
    name: 'Ocean Alliance',
    handle: '@oceanalliance',
    platform: 'Instagram',
    blurb: 'Drone-based research into whale health and behavior.',
    url: 'https://www.instagram.com/oceanalliance/',
    icon: BeakerIcon,
  },
  {
    name: 'Paul Nicklen',
    handle: '@paulnicklen',
    platform: 'Instagram',
    blurb: 'National Geographic photographer documenting cold-water species.',
    url: 'https://www.instagram.com/paulnicklen/',
    icon: CameraIcon,
  },
]
</script>
