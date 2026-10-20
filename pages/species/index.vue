<template>
  <div class="min-h-screen bg-base-100 py-16 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-10">
        <h1 class="text-5xl md:text-6xl font-whale mb-4">Whale Species</h1>
        <p class="text-lg text-base-content/70 max-w-2xl mx-auto">
          {{ species.length }} profiles, split between baleen filter-feeders and toothed
          predators. Search, filter, or just browse.
        </p>
      </div>

      <!-- Filter + search controls. On phones the two selects share a row. -->
      <div class="card bg-base-200 border border-base-300 mb-6 sm:mb-10">
        <div class="card-body p-4 md:p-5 grid grid-cols-2 gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
          <label class="input input-bordered flex items-center gap-2 col-span-2 max-md:w-full md:col-span-1">
            <MagnifyingGlassIcon class="h-5 w-5 opacity-60" />
            <input
              v-model="q"
              type="search"
              class="grow"
              placeholder="Search name, family, or habitat"
              aria-label="Search species"
            >
          </label>
          <select v-model="groupFilter" class="select select-bordered" aria-label="Filter by group">
            <option value="all">All groups</option>
            <option value="baleen">Baleen</option>
            <option value="toothed">Toothed</option>
          </select>
          <select v-model="statusFilter" class="select select-bordered" aria-label="Filter by status">
            <option value="all">All statuses</option>
            <option v-for="opt in statusOptions" :key="opt.code" :value="opt.code">{{ opt.label }}</option>
          </select>
          <button class="btn btn-ghost col-span-2 md:col-span-1" :disabled="!isFiltered" @click="reset">Reset</button>
        </div>
      </div>

      <div class="mb-6 flex items-center justify-between gap-4">
        <p class="text-sm text-base-content/60" aria-live="polite">
          Showing {{ filtered.length }} of {{ species.length }} species.
        </p>
        <button
          type="button"
          class="btn btn-ghost btn-sm gap-1.5 font-normal"
          :disabled="!filtered.length"
          :title="isFiltered ? 'Open a random species from these results' : 'Open a random species'"
          @click="surprise"
        >
          <SparklesIcon class="h-4 w-4" />
          Surprise me
        </button>
      </div>

      <div v-if="!filtered.length" class="text-center py-16 text-base-content/60">
        <p class="text-lg">No whales match that.</p>
        <button class="btn btn-primary btn-sm mt-4" @click="reset">Clear filters</button>
      </div>

      <div v-for="group in groups" :key="group.label" class="mb-12 sm:mb-16">
        <div class="flex items-baseline justify-between mb-4 sm:mb-6 px-1">
          <h2 class="text-2xl font-whale">{{ group.label }}</h2>
          <span class="text-sm text-base-content/60">{{ group.items.length }} species</span>
        </div>

        <!-- Phones get compact rows (thumbnail, names, status); from sm up, the card grid.
             One set of markup restyled per breakpoint, so each photo is fetched only once. -->
        <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          <li v-for="entry in group.items" :key="entry.id">
            <NuxtLink
              :to="`/species/${entry.id}`"
              class="group block h-full rounded-box focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <div class="card h-full flex-row items-center overflow-hidden border border-base-300 bg-base-200 transition-all duration-300 max-sm:active:bg-base-300 sm:flex-col sm:items-stretch sm:shadow-lg sm:hover:-translate-y-1 sm:hover:shadow-2xl">
                <!-- Not a <figure>: DaisyUI centres `.card figure` as a flex row, which fights the thumbnail sizing. -->
                <div class="m-2 size-20 flex-none overflow-hidden rounded-lg bg-base-300 sm:m-0 sm:aspect-[4/3] sm:h-auto sm:w-full sm:rounded-none">
                  <!-- The name is right beside it in the link, so the photo is decorative here. -->
                  <NuxtImg
                    :src="entry.adult.image"
                    alt=""
                    sizes="xs:80px sm:50vw md:50vw lg:33vw xl:25vw"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div class="card-body min-w-0 gap-0.5 py-2 pl-1 pr-0 sm:gap-2 sm:p-6">
                  <h3 class="card-title text-base leading-snug sm:text-lg">{{ entry.name }}</h3>
                  <!-- grow-0: DaisyUI gives every <p> in a card body flex-grow: 1, which would
                       park spare height under the name instead of above the card footer. -->
                  <p class="grow-0 truncate text-xs italic text-base-content/60 sm:text-sm">{{ entry.scientificName }}</p>
                  <p class="text-sm text-base-content/80 line-clamp-2 max-sm:hidden">{{ entry.description }}</p>
                  <div class="mt-1 sm:hidden">
                    <StatusBadge :status="entry.conservationStatus" plain />
                  </div>
                  <div class="card-actions justify-between items-center mt-2 max-sm:hidden">
                    <StatusBadge :status="entry.conservationStatus" short />
                    <span class="text-primary text-sm flex items-center gap-1">
                      Read
                      <ArrowRightIcon class="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
                <ChevronRightIcon
                  class="mr-3 h-5 w-5 flex-none text-base-content/40 transition-colors group-hover:text-primary sm:hidden"
                  aria-hidden="true"
                />
              </div>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRightIcon, ChevronRightIcon, MagnifyingGlassIcon, SparklesIcon } from '@heroicons/vue/24/outline'
import type { IucnCode } from '~/types/species'
import { species } from '~/data/species'
import { iucnMeta, iucnFromStatus } from '~/data/iucn'

defineOptions({ name: 'SpeciesIndexPage' })

useSeoMeta({
  title: 'Whale Species, Whalesome',
  description: `Browse ${species.length} whale species profiles, from blue whales to vaquitas. Search and filter by group, conservation status, and habitat.`,
  ogTitle: 'Whale Species, Whalesome',
  ogDescription: `Browse ${species.length} whale species profiles, from blue whales to vaquitas.`,
  twitterCard: 'summary_large_image',
})

const route = useRoute()
const router = useRouter()

const q = ref('')
const groupFilter = ref<'all' | 'baleen' | 'toothed'>('all')
const statusFilter = ref<'all' | IucnCode>('all')

// Only offer status options that actually appear in the data.
const statusOptions = computed(() => {
  const present = new Set(species.map(s => iucnFromStatus(s.conservationStatus)))
  return (Object.keys(iucnMeta) as IucnCode[])
    .filter(code => present.has(code))
    .map(code => ({ code, label: iucnMeta[code].label }))
})

const isFiltered = computed(() => q.value !== '' || groupFilter.value !== 'all' || statusFilter.value !== 'all')

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  return species.filter((s) => {
    if (groupFilter.value !== 'all' && s.group !== groupFilter.value) return false
    if (statusFilter.value !== 'all' && iucnFromStatus(s.conservationStatus) !== statusFilter.value) return false
    if (term) {
      const haystack = `${s.name} ${s.scientificName} ${s.family} ${s.habitat}`.toLowerCase()
      if (!haystack.includes(term)) return false
    }
    return true
  })
})

const groups = computed(() => [
  { label: 'Baleen whales', items: filtered.value.filter(s => s.group === 'baleen') },
  { label: 'Toothed whales', items: filtered.value.filter(s => s.group === 'toothed') },
].filter(g => g.items.length))

function reset() {
  q.value = ''
  groupFilter.value = 'all'
  statusFilter.value = 'all'
}

/** Opens a random species, from the current results when a filter is set. */
function surprise() {
  const pool = filtered.value
  if (!pool.length) return
  navigateTo(`/species/${pool[Math.floor(Math.random() * pool.length)].id}`)
}

// Filters live in the query (?q=right&group=baleen&status=EN), so a filtered view can be
// shared and comes back after a trip to a profile and the back button. The prerendered page
// has no query, so it is read once mounted.
const one = (v: unknown) => (Array.isArray(v) ? v[0] : v)
let urlReady = false

onMounted(() => {
  const text = one(route.query.q)
  const group = one(route.query.group)
  const status = String(one(route.query.status) ?? '').toUpperCase()
  if (typeof text === 'string') q.value = text
  if (group === 'baleen' || group === 'toothed') groupFilter.value = group
  if (Object.keys(iucnMeta).includes(status)) statusFilter.value = status as IucnCode
  urlReady = true
})

const listPath = computed(() => router.resolve({
  path: '/species',
  query: {
    q: q.value.trim() || undefined,
    group: groupFilter.value === 'all' ? undefined : groupFilter.value,
    status: statusFilter.value === 'all' ? undefined : statusFilter.value,
  },
}).fullPath)

// Remembered for the visit, so "All species" on a profile leads back to this same list.
const lastListPath = useState('species-list-path', () => '/species')
watch(listPath, (path) => {
  lastListPath.value = path
}, { immediate: true })

watchDebounced(listPath, (path) => {
  // A debounced write can land after the reader has already opened a profile.
  if (!urlReady || router.currentRoute.value.path !== route.path) return
  if (path !== router.currentRoute.value.fullPath) router.replace(path)
}, { debounce: 300 })
</script>
