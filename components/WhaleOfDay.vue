<template>
  <section class="px-6 py-12">
    <div class="max-w-5xl mx-auto">
      <ClientOnly>
        <!-- The whole card is clickable through the title link, which stretches over it.
             The link itself only carries the whale's name, so it reads cleanly. -->
        <article
          v-if="whale"
          class="group card md:card-side relative overflow-hidden border border-white/15 bg-base-100/55 shadow-xl backdrop-blur-md transition-colors duration-300 hover:border-primary/40 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-primary md:min-h-80"
        >
          <figure class="h-52 shrink-0 md:h-auto md:w-72">
            <NuxtImg
              :src="whale.adult.image"
              :alt="whale.name"
              sizes="sm:100vw md:288px"
              class="h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
            />
          </figure>
          <!-- DaisyUI lets every <p> in a card body grow to fill spare height, which is what
               opened the uneven gaps here. grow-0 keeps each line tight to the next. -->
          <div class="card-body gap-0 p-6 md:p-8">
            <h2 class="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs">
              <span class="uppercase tracking-[0.25em] text-primary">Whale of the day</span>
              <span class="text-white/75">{{ today }}</span>
            </h2>
            <h3 class="card-title mt-3 text-2xl leading-tight text-white">
              <NuxtLink
                :to="`/species/${whale.id}`"
                class="after:absolute after:inset-0 focus-visible:outline-none"
              >
                {{ whale.name }}
              </NuxtLink>
            </h3>
            <p class="mt-1 grow-0 text-sm italic text-white/75">{{ whale.scientificName }}</p>
            <p class="mt-4 grow-0 text-sm leading-relaxed text-white/85">{{ blurb }}</p>
            <dl class="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <div>
                <dt class="text-[0.7rem] uppercase tracking-[0.18em] text-white/70">Length</dt>
                <dd class="text-white/90">{{ whale.adult.size }}</dd>
              </div>
              <div>
                <dt class="text-[0.7rem] uppercase tracking-[0.18em] text-white/70">Weight</dt>
                <dd class="text-white/90">{{ whale.adult.weight }}</dd>
              </div>
            </dl>
            <div class="mt-6 flex flex-wrap items-center justify-between gap-3 md:mt-auto md:pt-6">
              <!-- Sits above the stretched link so the badge stays hoverable, on a dark
                   pill so its status colour holds contrast over the sunlit water. -->
              <span class="relative z-10 inline-flex rounded-full bg-base-300/80">
                <StatusBadge :status="whale.conservationStatus" />
              </span>
              <span
                class="inline-flex items-center gap-1 text-sm text-primary transition-[gap] duration-200 group-hover:gap-2 motion-reduce:transition-none"
                aria-hidden="true"
              >
                Read profile
                <ArrowRightIcon class="h-4 w-4" />
              </span>
            </div>
          </div>
        </article>
        <template #fallback>
          <!-- Same footprint as the card, so nothing jumps when today's whale arrives. -->
          <div
            class="card md:card-side overflow-hidden border border-white/10 bg-base-100/40 md:min-h-80"
            aria-hidden="true"
          >
            <div class="h-52 shrink-0 bg-white/5 md:h-auto md:w-72" />
            <div class="card-body gap-0 p-6 md:p-8 motion-safe:animate-pulse">
              <div class="h-3 w-44 rounded-full bg-white/15" />
              <div class="mt-4 h-6 w-56 max-w-full rounded-full bg-white/20" />
              <div class="mt-2 h-3.5 w-40 rounded-full bg-white/10" />
              <div class="mt-5 h-3 w-full rounded-full bg-white/10" />
              <div class="mt-2 h-3 w-11/12 rounded-full bg-white/10" />
              <div class="mt-2 h-3 w-2/3 rounded-full bg-white/10" />
              <div class="mt-5 flex gap-8">
                <div class="h-9 w-24 rounded-lg bg-white/10" />
                <div class="h-9 w-24 rounded-lg bg-white/10" />
              </div>
              <div class="mt-6 flex justify-between md:mt-auto md:pt-6">
                <div class="h-6 w-28 rounded-full bg-white/10" />
                <div class="h-4 w-24 rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import { species } from '~/data/species'

// Featured species already have a card further down the page, so the daily pick
// comes from the rest. That way the homepage never shows the same whale twice.
const pool = species.filter(s => !s.featured)

// Deterministic by day of year, so it is stable through the day and changes at
// midnight. Evaluated only on the client (inside ClientOnly), so it stays safe
// for the static prerender. UTC dates keep the day count exact across DST shifts.
const whale = computed(() => {
  const list = pool.length ? pool : species
  const now = new Date()
  const dayOfYear = (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(now.getFullYear(), 0, 0)) / 86_400_000
  return list[dayOfYear % list.length]
})

const today = computed(() =>
  new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }),
)

// Whole sentences from the start of a description, up to roughly `max` characters,
// so the card always ends on a full stop instead of a clipped line.
const SENTENCE = /[\s\S]+?[.!?]["'”’)]?(?=\s+["'“‘(]?[A-Z]|\s*$)/g
function leadSentences(text: string, max: number) {
  const sentences = text.match(SENTENCE) ?? [text]
  let out = (sentences[0] ?? text).trim()
  for (const s of sentences.slice(1)) {
    const next = `${out} ${s.trim()}`
    if (next.length > max) break
    out = next
  }
  return out
}

const blurb = computed(() => (whale.value ? leadSentences(whale.value.description, 220) : ''))
</script>
