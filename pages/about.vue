<template>
  <div class="min-h-screen bg-base-100 py-20 px-6">
    <div class="max-w-7xl mx-auto">
      <h1
        class="text-5xl md:text-6xl font-whale text-center mb-4"
      >
        About Whalesome
      </h1>
      <p
        class="text-xl text-center text-base-content/70 mb-16 max-w-3xl mx-auto"
      >
        A quiet tribute to the ocean’s largest residents, built as a place to learn, to
        experiment, and to share.
      </p>

      <div class="grid md:grid-cols-3 gap-8 mb-16">
        <div
          v-for="pillar in pillars"
          :key="pillar.title"
          class="card bg-base-200 shadow-xl"
        >
          <div class="card-body">
            <component :is="pillar.icon" class="h-12 w-12 mb-4 text-primary" />
            <h2 class="card-title text-2xl mb-4">{{ pillar.title }}</h2>
            <p class="text-base-content/80">{{ pillar.body }}</p>
            <p class="text-base-content/60 text-sm mt-4 italic">{{ pillar.quote }}</p>
          </div>
        </div>
      </div>

      <section
        class="card bg-base-200 shadow-xl mb-16"
        aria-labelledby="about-sections"
      >
        <div class="card-body">
          <h2 id="about-sections" class="card-title text-2xl mb-2">What You’ll Find Here</h2>
          <p class="text-base-content/70 mb-6">
            Whalesome is organized around a few simple questions: who whales are, where they fit
            in the tree of life, what whaling did to them, and what we can do to keep them here.
          </p>
          <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <li v-for="section in sections" :key="section.title">
              <NuxtLink
                :to="section.to"
                class="group flex h-full gap-4 rounded-xl border border-white/5 bg-base-100/60 p-4 transition-colors hover:border-primary/40 hover:bg-base-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <component :is="section.icon" class="mt-0.5 h-6 w-6 flex-shrink-0 text-primary" />
                <span>
                  <span class="flex items-center gap-1.5 font-semibold">
                    {{ section.title }}
                    <ArrowRightIcon
                      class="h-4 w-4 text-primary opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:group-hover:translate-x-0.5"
                    />
                  </span>
                  <span class="mt-1 block text-sm text-base-content/70">{{ section.body }}</span>
                </span>
              </NuxtLink>
            </li>
          </ul>
          <p class="mt-6 text-sm text-base-content/60">
            On a keyboard, press <kbd class="kbd kbd-sm">/</kbd> anywhere to jump straight to a whale.
          </p>
        </div>
      </section>

      <div
        class="card bg-base-200 shadow-xl"
      >
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">Built With</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="tech in stack" :key="tech.name" class="p-4 bg-base-100 rounded-lg">
              <p class="font-semibold">{{ tech.name }}</p>
              <p class="text-sm text-base-content/70">{{ tech.role }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-12">
        <NuxtLink to="/" class="btn btn-primary btn-lg">
          <ArrowLeftIcon class="h-5 w-5" />
          Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  HeartIcon,
  BeakerIcon,
  CodeBracketIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  IdentificationIcon,
  ShareIcon,
  BookOpenIcon,
  ChartBarIcon,
  ScaleIcon,
  LifebuoyIcon,
} from '@heroicons/vue/24/outline'

useSeoMeta({
  title: 'About, Whalesome',
  description: 'Why Whalesome exists: a love letter to whales, a sandbox for the web, and a small experiment in caring about something quietly.',
  ogTitle: 'About Whalesome',
  ogDescription: 'Why Whalesome exists, a love letter to whales and a sandbox for the web.',
  twitterCard: 'summary_large_image',
})

const pillars = [
  {
    icon: HeartIcon,
    title: 'Love for Whales',
    body: 'Whales are quiet evidence that the planet is stranger and older than we think. This site is an attempt to pay attention to them the way they deserve, without shouting, without kitsch.',
    quote: '“The ocean’s gentle giants remind us that wonder is still the right response to being alive.”',
  },
  {
    icon: BeakerIcon,
    title: 'A Sandbox for Learning',
    body: 'Whalesome is where I try things. Nuxt 3, a hand-tuned DaisyUI theme, ocean sound synthesized in the browser, static maps, prerender pipelines: each feature is an excuse to read a little further into the docs.',
    quote: '“If a feature isn’t teaching me anything, it probably isn’t worth keeping.”',
  },
  {
    icon: CodeBracketIcon,
    title: 'A Well-Made Web',
    body: 'Good sites feel like furniture: solid, considered, out of the way. This is a small place to practice that, with fast first paint, sensible typography, and real accessibility.',
    quote: '“The web is at its best when it disappears and leaves you with the content.”',
  },
]

const sections = [
  {
    to: '/species',
    icon: IdentificationIcon,
    title: 'Species Profiles',
    body: 'Side-by-side adult and calf information for the whales most people have heard of, and several they haven’t, with habitat maps, photo galleries, and a few recorded calls.',
  },
  {
    to: '/#classification',
    icon: ShareIcon,
    title: 'Classification Tree',
    body: 'The split between baleen and toothed whales, down to the families that group everything from blue whales to vaquitas.',
  },
  {
    to: '/history',
    icon: BookOpenIcon,
    title: 'Whaling History',
    body: 'A sourced timeline from Basque shore stations to the 1986 moratorium, and the uneven recovery since.',
  },
  {
    to: '/populations',
    icon: ChartBarIcon,
    title: 'Whales by the Numbers',
    body: 'How many are left, how far each species fell, and where it stands on the IUCN Red List today.',
  },
  {
    to: '/compare',
    icon: ScaleIcon,
    title: 'Compare Two Whales',
    body: 'Any two species side by side, from length and weight to habitat, drawn to the same scale.',
  },
  {
    to: '/#conservation',
    icon: LifebuoyIcon,
    title: 'Conservation',
    body: 'Organizations doing the slow, unglamorous work of keeping these animals alive, and the habits that make the biggest difference.',
  },
]

const stack = [
  { name: 'Nuxt 3', role: 'Vue framework, prerendered to static pages' },
  { name: 'Tailwind CSS v4', role: 'Utility styling, configured in CSS' },
  { name: 'DaisyUI v5', role: 'Components and the single “spirit” theme' },
  { name: 'VueUse', role: 'Composables for events and motion preferences' },
  { name: '@nuxt/image', role: 'Responsive, lazy-loaded photos' },
  { name: '@nuxt/fonts', role: 'Self-hosted Google Fonts' },
  { name: 'Heroicons', role: 'Outline icons throughout' },
  { name: 'Natural Earth', role: 'Coastlines for the habitat maps, drawn as static SVG' },
]
</script>
