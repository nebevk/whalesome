<template>
  <div class="min-h-screen bg-base-100 py-16 px-6">
    <div class="max-w-4xl mx-auto">
      <header class="text-center mb-14">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-3">Anatomy</p>
        <h1 class="text-5xl md:text-6xl font-whale mb-5">How Whales Work</h1>
        <p class="text-lg text-base-content/80 max-w-2xl mx-auto">
          Whale anatomy, rebuilt as working instruments. Each part of a figure stands for a real
          organ, and every number it shows comes from published research.
        </p>
      </header>

      <section id="echolocation" class="scroll-mt-24" aria-labelledby="echolocation-title">
        <h2 id="echolocation-title" class="text-3xl font-whale mb-3">Echolocation</h2>
        <p class="text-lg text-base-content/80 mb-6">
          Toothed whales see with sound. A click made in the nose is focused by the fatty melon,
          bounces off prey, and travels back through the lower jaw to the ear. The delay tells the
          whale how far away the fish is. Drag the fish, or focus the figure and use the arrow keys.
        </p>

        <FigureFrame
          src="/figures/echolocation.html"
          title="Interactive figure: a sonar test tank built like a dolphin’s head. Drag the fish, or focus the figure and use the arrow keys, to change its distance."
        />

        <!-- Mirrors `keys` and `caption` in figures/echolocation/build.mjs; the embed leaves them to this page. -->
        <ul class="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-base-content/80">
          <li v-for="key in keys" :key="key.label" class="flex items-center gap-2">
            <span class="h-0.5 w-5 flex-none rounded-full" :style="{ background: key.color }" aria-hidden="true" />
            {{ key.label }}
          </li>
        </ul>
        <p class="mt-4 text-sm leading-relaxed text-base-content/70">{{ caption }}</p>

        <h3 class="text-xl font-bold mt-12 mb-4">How the rig maps onto the whale</h3>
        <dl class="divide-y divide-base-content/10 rounded-box bg-base-200">
          <div v-for="part in parts" :key="part.rig" class="grid gap-1 px-5 py-3 sm:grid-cols-[1fr_1.3fr] sm:gap-6">
            <dt class="font-semibold">{{ part.rig }}</dt>
            <dd class="text-base-content/80">{{ part.whale }}</dd>
          </div>
        </dl>

        <h3 class="text-xl font-bold mt-12 mb-3">Which whales do this?</h3>
        <p class="text-base-content/80 mb-4">
          Every toothed whale echolocates, from the vaquita to the sperm whale. Baleen whales are
          not known to.
        </p>
        <ul class="flex flex-wrap gap-2">
          <li v-for="s in toothed" :key="s.id">
            <NuxtLink :to="`/species/${s.id}`" class="btn btn-sm btn-outline rounded-full font-normal">
              {{ s.name }}
            </NuxtLink>
          </li>
        </ul>

        <h3 class="text-xl font-bold mt-12 mb-3">Sources</h3>
        <ul class="space-y-2 text-sm text-base-content/80">
          <li v-for="source in sources" :key="source.href">
            <a :href="source.href" class="link link-hover" target="_blank" rel="noopener noreferrer">
              {{ source.label }}<span class="sr-only"> (opens in a new tab)</span>
            </a>
            <span class="text-base-content/60">: {{ source.note }}</span>
          </li>
        </ul>
        <p class="mt-6 text-xs text-base-content/60">
          Figure built with the
          <a href="https://github.com/wheresryan22/anatomy" class="link link-hover" target="_blank" rel="noopener noreferrer">Anatomy kit<span class="sr-only"> (opens in a new tab)</span></a>
          by Ryan (@wheresryan22), MIT licence.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { species } from '~/data/species'
// The figure's own model, so the caption here can never drift from the figure.
import * as M from '~/figures/echolocation/model.mjs'

useSeoMeta({
  title: 'How whales work, Whalesome',
  description: 'Whale anatomy rebuilt as working instruments. Drag a fish through a sonar tank built like a dolphin’s head to see how echolocation measures distance.',
  ogTitle: 'How whales work: echolocation',
  ogDescription: 'Drag a fish through a sonar tank built like a dolphin’s head to see how echolocation measures distance.',
  twitterCard: 'summary_large_image',
})

const fmt = (value: number, digits = 0) =>
  value.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })

const keys = [
  { label: 'Click, focused by the lens (the melon)', color: '#00f0ff' },
  { label: 'Echo, carried by the jaw fat to the ear', color: '#ff3ec8' },
  { label: 'Needle: time from click to echo', color: '#ffffff' },
]

const caption
  = `Each click lasts ${M.CLICK_US[0]} to ${M.CLICK_US[1]} µs in wild bottlenose dolphins and centres on `
  + `${M.CENTROID_KHZ[0]} to ${M.CENTROID_KHZ[1]} kHz, so its waves are ${fmt(M.wavelengthMm(M.CENTROID_KHZ[1]))} `
  + `to ${fmt(M.wavelengthMm(M.CENTROID_KHZ[0]))} mm long. The melon focuses it into a beam about ${M.BEAM_DEG}° wide. `
  + `Sound crosses seawater at about ${fmt(M.C)} m/s, so every millisecond of round trip means `
  + `${fmt(M.metresPerMs, 2)} m of range. The next click usually waits for the echo. `
  + `In the figure, sound runs ${M.SLOW} times slower than real so you can follow it.`

const parts = [
  { rig: 'A clicker whose two “lips” snap at each click', whale: 'The phonic lips, deep in the nasal passages below the blowhole' },
  { rig: 'A bellows that dips with every click', whale: 'The nasal air sacs: air pushed past the phonic lips drives each click' },
  { rig: 'A lens dome reaching through the tank’s glass end', whale: 'The melon, a fatty acoustic lens in the forehead that focuses clicks into a beam' },
  { rig: 'A fat-filled channel running back from the water', whale: 'Fat bodies in the lower jaw, which carry echoes in through a thin bony window' },
  { rig: 'An ear capsule on four soft springs', whale: 'The ear bones, hung on soft tissue and isolated from the skull' },
  { rig: 'A dial timing click to echo', whale: 'The brain, reading distance from the delay' },
  { rig: 'A fish on a carriage over a ruler in metres', whale: 'The prey, and how far away it is' },
]

const toothed = species.filter(s => s.group === 'toothed')

const sources = [
  { label: 'NASA JPL, the speed of sound in seawater', href: 'https://sealevel.jpl.nasa.gov/files/archive/activities/ts2ssac5.pdf', note: 'about 1,500 m/s' },
  { label: 'Wahlberg et al. 2011, Journal of the Acoustical Society of America', href: 'https://doi.org/10.1121/1.3624822', note: 'click duration and frequency in wild bottlenose dolphins' },
  { label: 'Au, Moore & Pawloski 1986, Journal of the Acoustical Society of America', href: 'https://doi.org/10.1121/1.394012', note: 'the width of the transmitted beam' },
  { label: 'Ladegaard et al. 2019, Journal of Experimental Biology', href: 'https://doi.org/10.1242/jeb.189217', note: 'the next click waiting for the echo' },
  { label: 'Cranford, Amundin & Norris 1996, Journal of Morphology', href: 'https://marineinfo.org/id/publication/260941', note: 'the phonic lips as the sound source' },
  { label: 'Cranford, Krysl & Amundin 2010, PLoS ONE', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2915923/', note: 'how the fats of the lower jaw pass sound into the ear bones' },
]
</script>
