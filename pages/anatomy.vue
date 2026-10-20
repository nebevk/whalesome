<template>
  <div class="min-h-screen bg-base-100 py-16 px-6">
    <div class="max-w-4xl mx-auto">
      <header class="text-center mb-10">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-3">Anatomy</p>
        <h1 class="text-5xl md:text-6xl font-whale mb-5">How Whales Work</h1>
        <p class="text-lg text-base-content/80 max-w-2xl mx-auto">{{ anatomyIntro }}</p>
      </header>

      <nav aria-label="On this page" class="mb-16">
        <ul class="flex flex-wrap justify-center gap-2">
          <li v-for="item in contents" :key="item.id">
            <a :href="`#${item.id}`" class="btn btn-sm btn-ghost rounded-full border border-base-content/15 font-normal">
              <span v-if="item.fig" class="text-primary">{{ item.fig }}</span>
              {{ item.label }}
            </a>
          </li>
        </ul>
      </nav>

      <!-- The body plan -->
      <section id="body-plan" class="scroll-mt-24" aria-labelledby="body-plan-title">
        <h2 id="body-plan-title" class="text-3xl font-whale mb-6">The whale body plan</h2>
        <div class="grid gap-4 md:grid-cols-2">
          <article
            v-for="topic in bodyPlan"
            :id="topic.id"
            :key="topic.id"
            class="scroll-mt-24 rounded-box bg-base-200 p-5"
          >
            <h3 class="flex items-center gap-2.5 text-lg font-bold mb-2">
              <component :is="topic.icon" class="h-6 w-6 flex-none text-primary" aria-hidden="true" />
              {{ topic.title }}
            </h3>
            <p class="text-base-content/80 mb-3">{{ topic.summary }}</p>
            <ul class="space-y-1.5 text-sm text-base-content/80">
              <li v-for="point in topic.points" :key="point" class="flex gap-2">
                <span class="mt-2 h-1 w-1 flex-none rounded-full bg-primary" aria-hidden="true" />
                <span>{{ point }}</span>
              </li>
            </ul>
            <a v-if="topic.link" :href="topic.link.href" class="link link-hover link-primary mt-3 inline-flex items-center gap-1 text-sm">
              {{ topic.link.label }}
              <ArrowRightIcon class="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <p class="mt-3 text-xs text-base-content/60">
              Sources:
              <template v-for="(source, i) in topic.sources" :key="source.href">
                <a :href="source.href" class="link link-hover" target="_blank" rel="noopener noreferrer">{{ source.label }}<span class="sr-only"> (opens in a new tab)</span></a><span v-if="i < topic.sources.length - 1">, </span>
              </template>
            </p>
          </article>
        </div>
      </section>

      <!-- Baleen vs toothed -->
      <section id="baleen-vs-toothed" class="scroll-mt-24 mt-16" aria-labelledby="contrast-title">
        <h2 id="contrast-title" class="text-3xl font-whale mb-6">Baleen whales and toothed whales</h2>
        <div class="overflow-x-auto rounded-box bg-base-200">
          <table class="table">
            <thead>
              <tr>
                <th scope="col" class="w-1/4" />
                <th scope="col" class="text-base-content">Baleen whales</th>
                <th scope="col" class="text-base-content">Toothed whales</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in baleenVsToothed.rows" :key="row.trait">
                <th scope="row" class="font-semibold">{{ row.trait }}</th>
                <td class="text-base-content/80">{{ row.baleen }}</td>
                <td class="text-base-content/80">{{ row.toothed }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-3 text-xs text-base-content/60">
          Sources:
          <template v-for="(source, i) in baleenVsToothed.sources" :key="source.href">
            <a :href="source.href" class="link link-hover" target="_blank" rel="noopener noreferrer">{{ source.label }}<span class="sr-only"> (opens in a new tab)</span></a><span v-if="i < baleenVsToothed.sources.length - 1">, </span>
          </template>
        </p>
      </section>

      <!-- Interactive figures, each rendered from its model's `page` (data/figures.ts) -->
      <section
        v-for="figure in figures"
        :id="figure.id"
        :key="figure.id"
        class="scroll-mt-24 mt-20"
        :aria-labelledby="`${figure.id}-title`"
      >
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">{{ figure.fig }}</p>
        <h2 :id="`${figure.id}-title`" class="text-3xl font-whale mb-3">{{ figure.heading }}</h2>
        <p class="text-lg text-base-content/80 mb-6">{{ figure.lead }}</p>

        <FigureFrame :src="figure.src" :title="figure.frameTitle" />

        <ul class="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-base-content/80">
          <li v-for="key in figure.keys" :key="key.label" class="flex items-center gap-2">
            <span class="h-0.5 w-5 flex-none rounded-full" :style="{ background: key.color }" aria-hidden="true" />
            {{ key.label }}
          </li>
        </ul>
        <p class="mt-4 text-sm leading-relaxed text-base-content/70">{{ figure.caption }}</p>

        <h3 class="text-xl font-bold mt-10 mb-4">How the rig maps onto the whale</h3>
        <dl class="divide-y divide-base-content/10 rounded-box bg-base-200">
          <div v-for="part in figure.parts" :key="part.rig" class="grid gap-1 px-5 py-3 sm:grid-cols-[1fr_1.3fr] sm:gap-6">
            <dt class="font-semibold">{{ part.rig }}</dt>
            <dd class="text-base-content/80">{{ part.whale }}</dd>
          </div>
        </dl>

        <h3 class="text-xl font-bold mt-10 mb-3">Which whales?</h3>
        <p class="text-base-content/80 mb-4">{{ figure.speciesNote }}</p>
        <ul class="flex flex-wrap gap-2">
          <li v-for="s in speciesOf(figure)" :key="s.id">
            <NuxtLink :to="`/species/${s.id}`" class="btn btn-sm btn-outline rounded-full font-normal">{{ s.name }}</NuxtLink>
          </li>
        </ul>

        <h3 class="text-xl font-bold mt-10 mb-3">Sources</h3>
        <ul class="space-y-2 text-sm text-base-content/80">
          <li v-for="source in figure.sources" :key="source.href">
            <a :href="source.href" class="link link-hover" target="_blank" rel="noopener noreferrer">
              {{ source.label }}<span class="sr-only"> (opens in a new tab)</span>
            </a>
            <span class="text-base-content/60">: {{ source.note }}</span>
          </li>
        </ul>
      </section>

      <p class="mt-16 text-center text-xs text-base-content/60">
        Figures built with the
        <a href="https://github.com/wheresryan22/anatomy" class="link link-hover" target="_blank" rel="noopener noreferrer">Anatomy kit<span class="sr-only"> (opens in a new tab)</span></a>
        by Ryan (@wheresryan22), MIT licence.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import { species } from '~/data/species'
import { anatomyIntro, bodyPlan, baleenVsToothed } from '~/data/anatomy'
import { figures, type FigurePage } from '~/data/figures'

useSeoMeta({
  title: 'How whales work, Whalesome',
  description: 'Whale anatomy explained: the body plan, baleen versus toothed whales, and interactive figures of echolocation, sperm whale clicks, lunge feeding and deep diving.',
  ogTitle: 'How whales work',
  ogDescription: 'The whale body plan and interactive figures of echolocation, sperm whale clicks, lunge feeding and deep diving.',
  twitterCard: 'summary_large_image',
})

const contents = [
  { id: 'body-plan', label: 'Body plan' },
  { id: 'baleen-vs-toothed', label: 'Baleen vs toothed' },
  ...figures.map(f => ({ id: f.id, label: f.heading, fig: f.fig })),
]

const byId = new Map(species.map(s => [s.id, s]))
const speciesOf = (figure: FigurePage) =>
  figure.species.map(id => byId.get(id)).filter((s): s is NonNullable<typeof s> => !!s)
</script>
