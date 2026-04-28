<template>
  <div class="min-h-screen bg-base-100 py-20 px-6">
    <div class="max-w-7xl mx-auto">
      <h1
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.8 } }"
        class="text-5xl md:text-6xl font-whale text-center mb-4"
      >
        About Whalesome
      </h1>
      <p
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1 } }"
        class="text-xl text-center text-base-content/70 mb-16 max-w-3xl mx-auto"
      >
        A quiet tribute to the ocean's largest residents — built as a place to learn, to
        experiment, and to share.
      </p>

      <div class="grid md:grid-cols-3 gap-8 mb-16">
        <div
          v-for="(pillar, i) in pillars"
          :key="pillar.title"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 + i * 0.1 } }"
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

      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.5 } }"
        class="card bg-base-200 shadow-xl mb-16"
      >
        <div class="card-body">
          <h2 class="card-title text-2xl mb-2">What You'll Find Here</h2>
          <p class="text-base-content/70 mb-6">
            Whalesome is organized around three ideas: who whales are, where they fit in the tree
            of life, and what we can do to keep them here.
          </p>
          <div class="grid md:grid-cols-3 gap-6">
            <div>
              <h3 class="font-semibold mb-2">Species Profiles</h3>
              <p class="text-sm text-base-content/70">
                Side-by-side adult and calf information for the whales most people have heard of,
                and several they haven't.
              </p>
            </div>
            <div>
              <h3 class="font-semibold mb-2">Classification Tree</h3>
              <p class="text-sm text-base-content/70">
                The split between baleen and toothed whales, down to the families that group
                everything from blue whales to vaquitas.
              </p>
            </div>
            <div>
              <h3 class="font-semibold mb-2">Conservation</h3>
              <p class="text-sm text-base-content/70">
                Organizations doing the slow, unglamorous work of keeping these animals alive, and
                the habits that make the biggest difference.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.6 } }"
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
} from '@heroicons/vue/24/outline'

const pillars = [
  {
    icon: HeartIcon,
    title: 'Love for Whales',
    body: 'Whales are quiet evidence that the planet is stranger and older than we think. This site is an attempt to pay attention to them the way they deserve — without shouting, without kitsch.',
    quote: '"The ocean\'s gentle giants remind us that wonder is still the right response to being alive."',
  },
  {
    icon: BeakerIcon,
    title: 'A Sandbox for Learning',
    body: 'Whalesome is where I try things. Nuxt 3, DaisyUI themes, motion directives, prerender pipelines — each feature is an excuse to read a little further into the docs.',
    quote: '"If a feature isn\'t teaching me anything, it probably isn\'t worth keeping."',
  },
  {
    icon: CodeBracketIcon,
    title: 'Love for the Web',
    body: 'Good sites feel like furniture: solid, considered, out of the way. This is a small place to practice that — fast first paint, sensible typography, real accessibility.',
    quote: '"The web is at its best when it disappears and leaves you with the content."',
  },
]

const stack = [
  { name: 'Nuxt 3', role: 'Vue framework' },
  { name: 'Tailwind CSS', role: 'Utility styling' },
  { name: 'DaisyUI', role: 'Theme system' },
  { name: 'VueUse Motion', role: 'Animations' },
]
</script>
