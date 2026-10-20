<template>
  <div class="min-h-screen bg-base-100 py-8 px-6">
    <ReadingProgress />
    <div class="max-w-7xl mx-auto">
      <div class="mb-6 lg:mb-8">
        <NuxtLink :to="listPath" class="btn btn-ghost btn-sm gap-1">
          <ArrowLeftIcon class="h-4 w-4" />
          All species
        </NuxtLink>
      </div>

      <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <!-- From lg up: the full list as a sticky sidebar. Below lg: a compact sticky switcher,
             so the whale you tapped is not buried under 22 links. Each hides itself. -->
        <SpeciesNav :species-list="ordered" :selected-species-id="id" />
        <SpeciesSwitcher v-if="current" :species-list="ordered" :current="current" :prev="prev" :next="next" />

        <div class="flex-1 min-w-0">
          <SpeciesDetail v-if="current" :species="current" />

          <nav v-if="current" aria-label="Previous and next species" class="mt-10">
            <div class="flex items-stretch justify-between gap-4">
              <NuxtLink
                v-if="prev"
                :to="`/species/${prev.id}`"
                rel="prev"
                aria-keyshortcuts="ArrowLeft"
                class="group flex-1 max-w-xs rounded-box border border-base-300 bg-base-200 px-4 py-3 transition-colors hover:border-primary/30 hover:bg-base-300"
              >
                <span class="flex items-center gap-1 text-xs text-base-content/60">
                  <ArrowLeftIcon class="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
                  Previous
                </span>
                <span class="mt-1 block font-semibold">{{ prev.name }}</span>
              </NuxtLink>
              <div v-else class="flex-1 max-w-xs" />

              <NuxtLink
                v-if="next"
                :to="`/species/${next.id}`"
                rel="next"
                aria-keyshortcuts="ArrowRight"
                class="group flex-1 max-w-xs rounded-box border border-base-300 bg-base-200 px-4 py-3 text-right transition-colors hover:border-primary/30 hover:bg-base-300"
              >
                <span class="flex items-center justify-end gap-1 text-xs text-base-content/60">
                  Next
                  <ArrowRightIcon class="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
                <span class="mt-1 block font-semibold">{{ next.name }}</span>
              </NuxtLink>
            </div>

            <!-- Only where there is likely a keyboard. Screen readers get aria-keyshortcuts on
                 the links above instead, so this visual hint is hidden from them. -->
            <p class="mt-4 hidden items-center justify-center gap-1.5 text-xs text-base-content/50 pointer-fine:flex" aria-hidden="true">
              <kbd class="kbd kbd-sm"><ArrowLeftIcon class="h-3 w-3" /></kbd>
              <kbd class="kbd kbd-sm"><ArrowRightIcon class="h-3 w-3" /></kbd>
              <span class="ml-1">to browse species</span>
            </p>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'
import { species } from '~/data/species'

defineOptions({ name: 'SpeciesDetailPage' })

definePageMeta({
  validate: (route) => species.some(s => s.id === route.params.id),
})

const route = useRoute()

// "All species" goes back to the index as the reader left it, filters and all. The index keeps
// this up to date; a direct visit (and the prerender) gets the plain list.
const listPath = useState('species-list-path', () => '/species')

// Browse order: baleen first, then toothed, each in data order. The same grouping as the
// species index and the sidebar, so prev/next, the arrow keys and "3 of 22" all agree with
// the list the reader is looking at.
const ordered = [
  ...species.filter(s => s.group === 'baleen'),
  ...species.filter(s => s.group === 'toothed'),
]

const id = computed(() => String(route.params.id))
const currentIndex = computed(() => ordered.findIndex(s => s.id === id.value))
const current = computed(() => ordered[currentIndex.value] ?? null)
const prev = computed(() => (currentIndex.value > 0 ? ordered[currentIndex.value - 1] : null))
const next = computed(() => (currentIndex.value >= 0 && currentIndex.value < ordered.length - 1 ? ordered[currentIndex.value + 1] : null))

// Left and right arrows page through species. They stay out of the way of anything that
// owns those keys itself: form fields, media and sliders, the adult/calf photo comparison,
// the nav's dropdown panels, and any open modal. The gallery lightbox teleports an
// aria-modal element to <body> while open, and quick find and the species picker are
// <dialog>s, so one query covers them all without any of them having to expose state.
const ARROW_KEY_OWNERS = [
  'input', 'textarea', 'select', 'audio', 'video', '[contenteditable]:not([contenteditable="false"])',
  '[role="slider"]', '[role="listbox"]', '[role="menu"]', '[role="menubar"]', '[role="radiogroup"]',
  '[role="tablist"]', '[role="grid"]', '[role="tree"]', '.diff', '.dropdown',
].join(', ')

useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
  if (e.defaultPrevented || e.repeat || e.isComposing || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
  if (e.target instanceof Element && e.target.closest(ARROW_KEY_OWNERS)) return
  if (document.querySelector('[aria-modal="true"], dialog[open]')) return

  const target = e.key === 'ArrowLeft' ? prev.value : next.value
  if (!target) return
  e.preventDefault()
  navigateTo(`/species/${target.id}`)
})

if (current.value) {
  const c = current.value
  useSeoMeta({
    title: `${c.name}, Whalesome`,
    description: c.description,
    ogTitle: `${c.name} (${c.scientificName})`,
    ogDescription: c.description,
    ogImage: c.adult.image,
    twitterCard: 'summary_large_image',
    twitterImage: c.adult.image,
  })
}
</script>
