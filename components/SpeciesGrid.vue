<template>
  <section class="py-20 px-6">
    <div class="max-w-7xl mx-auto">
      <h2
        class="text-4xl md:text-5xl font-whale text-white mb-4 text-center"
      >
        Featured Species
      </h2>
      <p
        class="text-lg text-white/80 mb-12 text-center max-w-3xl mx-auto"
      >
        {{ countWord }} whales worth starting with. Each links to a fuller profile with adult and calf detail.
      </p>

      <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
        <li
          v-for="entry in featuredSpecies"
          :key="entry.id"
        >
          <!-- The title link stretches over the whole card, so the card stays one big
               target while the link's name is just the species. -->
          <article
            class="group card relative h-full border border-white/20 bg-base-100/20 shadow-xl backdrop-blur-sm transition-[scale,box-shadow,border-color] duration-300 hover:border-primary/40 hover:shadow-2xl motion-safe:hover:scale-[1.02] has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-primary"
          >
            <figure class="px-6 pt-6">
              <NuxtImg
                :src="entry.adult.image"
                :alt="entry.name"
                sizes="sm:100vw md:50vw lg:25vw"
                class="w-full h-48 object-cover rounded-lg"
              />
            </figure>
            <!-- grow-0 stops DaisyUI stretching each <p> when the grid evens out card
                 heights; the footer takes the spare room instead, so badges line up. -->
            <div class="card-body gap-0">
              <h3 class="card-title text-white text-xl">
                <NuxtLink
                  :to="`/species/${entry.id}`"
                  class="after:absolute after:inset-0 focus-visible:outline-none"
                >
                  {{ entry.name }}
                </NuxtLink>
              </h3>
              <p class="mt-1 grow-0 text-white/75 text-sm italic">{{ entry.scientificName }}</p>
              <p class="mt-3 grow-0 text-white/85 text-sm leading-relaxed line-clamp-5">{{ teaser(entry.description) }}</p>
              <div class="mt-auto pt-5 flex items-center justify-between gap-3">
                <span class="relative z-10 inline-flex rounded-full bg-base-300/80">
                  <StatusBadge :status="entry.conservationStatus" short />
                </span>
                <span class="inline-flex items-center gap-1 text-primary text-sm" aria-hidden="true">
                  Read
                  <ArrowRightIcon class="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </article>
        </li>
      </ul>

      <div class="mt-12 text-center">
        <NuxtLink to="/species" class="btn btn-primary btn-lg">
          View all {{ species.length }} species
          <ArrowRightIcon class="h-5 w-5" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import { species, featuredSpecies } from '~/data/species'

const NUMBER_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight']
const countWord = NUMBER_WORDS[featuredSpecies.length] ?? String(featuredSpecies.length)

// Whole sentences from the start of a description, up to roughly `max` characters.
// A plain line clamp could stop right after a full stop and then add its own
// ellipsis (“.…”); a teaser made of complete sentences ends cleanly instead.
// The clamp stays only as a safety net for an unusually long first sentence.
const SENTENCE = /[\s\S]+?[.!?]["'”’)]?(?=\s+["'“‘(]?[A-Z]|\s*$)/g
function teaser(text: string, max = 120) {
  const sentences = text.match(SENTENCE) ?? [text]
  let out = (sentences[0] ?? text).trim()
  for (const s of sentences.slice(1)) {
    const next = `${out} ${s.trim()}`
    if (next.length > max) break
    out = next
  }
  return out
}
</script>
