<template>
  <div class="min-h-screen bg-base-100 py-16 px-6">
    <div class="max-w-5xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-5xl md:text-6xl font-whale mb-4">Compare</h1>
        <p class="text-lg text-base-content/70 max-w-2xl mx-auto">
          Pick any two and see them side by side.
        </p>
      </div>

      <!-- Quick picks: pairings worth a look -->
      <div class="mb-8 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Suggested comparisons">
        <span class="mr-1 text-xs uppercase tracking-wide text-base-content/50" aria-hidden="true">Try</span>
        <button
          v-for="pair in pairs"
          :key="pair.label"
          type="button"
          class="btn btn-sm rounded-full font-normal"
          :class="isShowing(pair) ? 'btn-primary btn-soft' : 'btn-ghost border-base-content/15'"
          :aria-current="isShowing(pair) ? 'true' : undefined"
          :title="`${nameOf(pair.a)} and ${nameOf(pair.b)}`"
          @click="show(pair)"
        >
          {{ pair.label }}
        </button>
      </div>

      <!-- Pickers and cards share one column template, so each select sits over its card.
           Phones stack it all, with the swap button between the two selects. -->
      <div class="grid items-center gap-2 md:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] md:gap-x-3">
        <!-- v-model (not :value) so SSR marks the right <option> as selected; a bound :value
             on <select> is skipped during hydration and the prerendered page shows the first option. -->
        <select v-model="ids[0]" class="select select-bordered w-full" aria-label="First whale">
          <optgroup v-for="group in optionGroups" :key="group.label" :label="group.label">
            <option v-for="s in group.items" :key="s.id" :value="s.id">{{ s.name }}</option>
          </optgroup>
        </select>
        <button
          type="button"
          class="btn btn-ghost btn-circle btn-sm justify-self-center"
          aria-label="Swap the two whales"
          title="Swap sides"
          @click="swap"
        >
          <ArrowsUpDownIcon class="h-5 w-5 md:hidden" />
          <ArrowsRightLeftIcon class="hidden h-5 w-5 md:block" />
        </button>
        <select v-model="ids[1]" class="select select-bordered w-full" aria-label="Second whale">
          <optgroup v-for="group in optionGroups" :key="group.label" :label="group.label">
            <option v-for="s in group.items" :key="s.id" :value="s.id">{{ s.name }}</option>
          </optgroup>
        </select>
      </div>

      <div class="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] md:gap-x-3">
        <template v-for="(side, i) in [left, right]" :key="i">
          <!-- Grid rows stretch both cards to the same height. The spare height of the shorter
               card goes above its profile link (mt-auto), not into the scientific name. -->
          <article
            v-if="side"
            class="card bg-base-200 border border-base-300 shadow-lg overflow-hidden"
            :class="{ 'md:col-start-3': i === 1 }"
          >
            <div class="aspect-[16/10] overflow-hidden bg-base-300">
              <NuxtImg :src="side.adult.image" :alt="side.name" sizes="sm:100vw md:50vw" class="w-full h-full object-cover" />
            </div>
            <div class="card-body">
              <h2 class="card-title text-2xl">{{ side.name }}</h2>
              <!-- grow-0: DaisyUI gives every <p> inside .card-body flex-grow: 1. In a stretched
                   card this line soaked up the spare height, which was the gap above the badge. -->
              <p class="grow-0 text-sm italic text-base-content/60 -mt-1">{{ side.scientificName }}</p>
              <div class="my-2"><StatusBadge :status="side.conservationStatus" /></div>
              <dl class="text-sm divide-y divide-base-300">
                <div v-for="row in attrs(side)" :key="row.label" class="flex justify-between gap-4 py-2">
                  <dt class="text-base-content/60 flex-shrink-0">{{ row.label }}</dt>
                  <dd class="text-right font-medium">{{ row.value }}</dd>
                </div>
              </dl>
              <NuxtLink :to="`/species/${side.id}`" class="btn btn-ghost btn-sm mt-auto self-start gap-1">
                Full profile
                <ArrowRightIcon class="h-4 w-4" />
              </NuxtLink>
            </div>
          </article>
        </template>
      </div>

      <!-- Combined size-to-scale, the same component the species pages use -->
      <SizeComparison
        v-if="left && right"
        class="mt-8"
        :name="left.name"
        :size="left.adult.size"
        :versus="{ name: right.name, size: right.adult.size }"
      />

      <div class="mt-6 flex justify-center">
        <button type="button" class="btn btn-ghost btn-sm gap-2 font-normal" @click="copyLink">
          <CheckIcon v-if="copied" class="h-4 w-4 text-success" />
          <LinkIcon v-else class="h-4 w-4" />
          {{ copied ? 'Link copied' : 'Copy a link to this comparison' }}
        </button>
        <span class="sr-only" aria-live="polite">{{ copied ? 'Link copied to the clipboard.' : '' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRightIcon, ArrowsRightLeftIcon, ArrowsUpDownIcon, CheckIcon, LinkIcon } from '@heroicons/vue/24/outline'
import type { WhaleSpecies } from '~/types/species'
import { species } from '~/data/species'

defineOptions({ name: 'ComparePage' })

useSeoMeta({
  title: 'Compare whales, Whalesome',
  description: 'Put any two whales side by side: size, weight, conservation status, and habitat, drawn to the same scale.',
  ogTitle: 'Compare whales',
  ogDescription: 'Put any two whales side by side, drawn to the same scale.',
  twitterCard: 'summary_large_image',
})

const route = useRoute()
const router = useRouter()

const DEFAULT_PAIR = ['blue-whale', 'orca']
const ids = ref([...DEFAULT_PAIR])

const byId = (id: string) => species.find(s => s.id === id) ?? null
const nameOf = (id: string) => byId(id)?.name ?? id
const isSpeciesId = (v: unknown): v is string => typeof v === 'string' && species.some(s => s.id === v)

const left = computed(() => byId(ids.value[0]))
const right = computed(() => byId(ids.value[1]))

const optionGroups = [
  { label: 'Baleen whales', items: species.filter(s => s.group === 'baleen') },
  { label: 'Toothed whales', items: species.filter(s => s.group === 'toothed') },
]

function attrs(s: WhaleSpecies) {
  return [
    { label: 'Group', value: `${s.group.charAt(0).toUpperCase()}${s.group.slice(1)} whale` },
    { label: 'Family', value: s.family },
    { label: 'Length', value: s.adult.size },
    { label: 'Weight', value: s.adult.weight },
    { label: 'Habitat', value: s.habitat },
  ]
}

function meters(size: string): number {
  const found = [...size.matchAll(/([\d.]+)\s*m\b/g)].map(m => parseFloat(m[1]))
  return found.length ? Math.max(...found) : 0
}

interface Pair { label: string; a: string; b: string }

// Suggested pairings. The size extremes are worked out from the data, so the first pick
// stays true if species are added.
const bySize = [...species].sort((a, b) => meters(b.adult.size) - meters(a.adult.size))
const pairs: Pair[] = [
  { label: 'Largest vs smallest', a: bySize[0].id, b: bySize[bySize.length - 1].id },
  { label: 'Arctic cousins', a: 'narwhal', b: 'beluga-whale' },
  { label: 'Deep divers', a: 'sperm-whale', b: 'cuviers-beaked-whale' },
  { label: 'Right whales', a: 'north-atlantic-right-whale', b: 'southern-right-whale' },
  { label: 'Dolphin vs porpoise', a: 'common-bottlenose-dolphin', b: 'harbour-porpoise' },
].filter(p => isSpeciesId(p.a) && isSpeciesId(p.b))

const isShowing = (p: Pair) =>
  (ids.value[0] === p.a && ids.value[1] === p.b) || (ids.value[0] === p.b && ids.value[1] === p.a)

function show(p: Pair) {
  ids.value = [p.a, p.b]
}

function swap() {
  ids.value = [ids.value[1], ids.value[0]]
}

// Shareable comparisons: /compare?a=blue-whale&b=orca. The prerendered HTML has no query,
// so a shared pair is applied once mounted. After that every change is mirrored into the
// URL with replace(), so picking around adds no history entries. A plain /compare visit
// keeps a clean URL until the reader changes something.
let urlReady = false
onMounted(() => {
  const { a, b } = route.query
  if (isSpeciesId(a)) ids.value[0] = a
  if (isSpeciesId(b)) ids.value[1] = b
  urlReady = true
})

watch(() => [ids.value[0], ids.value[1]], ([a, b]) => {
  if (!urlReady || (route.query.a === a && route.query.b === b)) return
  router.replace({ query: { ...route.query, a, b } })
})

const { copy, copied } = useClipboard({ legacy: true, copiedDuring: 2000 })

function copyLink() {
  const url = new URL('/compare', window.location.origin)
  url.searchParams.set('a', ids.value[0])
  url.searchParams.set('b', ids.value[1])
  copy(url.toString())
}
</script>
