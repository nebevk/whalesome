<template>
  <!-- Rendered inside the default layout, so the nav, quick find, and footer
       are all here to help find a way back. -->
  <NuxtLayout>
    <section class="px-6 py-16 md:py-24">
      <div class="mx-auto max-w-xl text-center">
        <!-- A tail slipping under the swell: the whales are fine, it is the page that drifted -->
        <div class="relative mx-auto mb-6 h-28 w-40" aria-hidden="true">
          <WhaleLogo
            class="lost-tail absolute left-1/2 top-0 h-24 w-24 -translate-x-1/2 text-primary"
            :wave="false"
          />
          <svg
            class="absolute inset-x-0 bottom-0 h-8 w-full text-primary/40"
            viewBox="0 0 160 32"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
          >
            <path class="swell" d="M0 12c13-8 27-8 40 0s27 8 40 0 27-8 40 0 27 8 40 0 27-8 40 0 27 8 40 0" />
            <path class="swell swell-slow" d="M0 26c13-8 27-8 40 0s27 8 40 0 27-8 40 0 27 8 40 0 27-8 40 0 27 8 40 0" opacity="0.6" />
          </svg>
        </div>

        <p class="text-7xl md:text-8xl font-whale text-primary leading-none select-none">
          {{ statusCode }}
        </p>
        <h1 class="text-3xl md:text-4xl font-whale mt-4 mb-4">{{ title }}</h1>
        <p class="text-base-content/75 mb-8">{{ message }}</p>

        <div v-if="suggestions.length" class="mb-10">
          <p class="text-sm text-base-content/65 mb-3">Perhaps you meant</p>
          <ul class="flex flex-wrap justify-center gap-2">
            <li v-for="suggestion in suggestions" :key="suggestion.to">
              <NuxtLink
                :to="suggestion.to"
                class="btn btn-sm h-11 sm:h-8 rounded-full border-white/15 bg-base-200/70 font-normal hover:border-primary/50"
              >
                {{ suggestion.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="flex flex-wrap justify-center gap-3">
          <button type="button" class="btn btn-primary" @click="handleHome">
            <HomeIcon class="h-5 w-5" />
            Back home
          </button>
          <!-- Navigating clears the error on its own, so a plain link is enough here -->
          <NuxtLink to="/species" class="btn btn-ghost">
            Browse species
          </NuxtLink>
          <button type="button" class="btn btn-ghost" @click="openQuickFind">
            <MagnifyingGlassIcon class="h-5 w-5" />
            Find a whale
          </button>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { species } from '~/data/species'

interface Props {
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
    url?: string
    data?: unknown
  }
}

const props = defineProps<Props>()

const statusCode = computed(() => props.error.statusCode || 500)
const isNotFound = computed(() => statusCode.value === 404)
const title = computed(() => {
  if (isNotFound.value) return 'Lost at sea'
  if (statusCode.value >= 500) return 'Something broke below the surface'
  return props.error.statusMessage || 'Something went wrong'
})
const message = computed(() => {
  if (isNotFound.value) {
    return 'The page you were looking for has drifted away. The whales are unbothered.'
  }
  return props.error.message || 'An unexpected error occurred. Try again, or head somewhere else.'
})

useHead({ htmlAttrs: { 'data-theme': 'spirit' } })
useSeoMeta({
  title: () => (isNotFound.value ? 'Page not found, Whalesome' : 'Something went wrong, Whalesome'),
  robots: 'noindex',
})

const { open: openQuickFind } = useQuickFind()

function handleHome() {
  clearError({ redirect: '/' })
}

// ---- “Perhaps you meant” ----
// Guess where a mistyped or outdated URL was headed by comparing its words with
// species names and page names. Pure string work, so the server and the browser
// always agree on the result.

const IGNORED = new Set(['whale', 'whales', 'the', 'and', 'html', 'htm', 'php', 'index', 'www', 'page'])
const ALIASES: Record<string, string[]> = { 'orca': ['killer'], 'sperm-whale': ['cachalot'] }

function words(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .split(/[^a-z0-9]+/)
    .filter(word => word.length >= 3 && word.length <= 30 && !IGNORED.has(word))
}

const destinations = [
  ...species.map(s => ({
    to: `/species/${s.id}`,
    label: s.name,
    words: [...words(`${s.name} ${s.scientificName}`), ...(ALIASES[s.id] ?? [])],
  })),
  { to: '/species', label: 'All species', words: ['species', 'all', 'browse'] },
  { to: '/history', label: 'Whaling history', words: ['history', 'whaling', 'timeline'] },
  { to: '/populations', label: 'Whales by the numbers', words: ['populations', 'population', 'numbers', 'statistics'] },
  { to: '/compare', label: 'Compare', words: ['compare', 'comparison', 'versus'] },
  { to: '/about', label: 'About', words: ['about'] },
]

/** Edit distance that also counts a swapped pair of letters ("histroy") as one slip. */
function editDistance(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
      }
    }
  }
  return d[a.length][b.length]
}

function similarity(typed: string, word: string) {
  if (typed === word) return 1
  if (word.startsWith(typed)) return 0.9 // "hump" for humpback
  if (typed.startsWith(word) && word.length >= 4) return 0.85 // "humpbacks"
  return 1 - editDistance(typed, word) / Math.max(typed.length, word.length)
}

/** The URL that failed. Nuxt keeps it in `data.path`, or in the status message. */
const failedPath = computed(() => {
  const data = props.error.data
  if (data && typeof data === 'object' && 'path' in data && typeof data.path === 'string') return data.path
  return props.error.statusMessage?.match(/not found:\s*(\S+)/i)?.[1] ?? props.error.url ?? ''
})

const suggestions = computed(() => {
  if (!isNotFound.value) return []
  let path = failedPath.value.split(/[?#]/)[0] ?? ''
  try {
    path = decodeURIComponent(path)
  }
  catch {
    // keep the raw path if it is not valid percent-encoding
  }
  const segments = path.split('/').filter(Boolean)
  // In "/species/blu-whale" only the last part carries meaning.
  const typed = words(segments[0] === 'species' && segments.length > 1 ? segments.slice(1).join(' ') : segments.join(' ')).slice(0, 6)
  if (!typed.length) return []

  return destinations
    .map((destination) => {
      const scores = typed.map(t => Math.max(...destination.words.map(w => similarity(t, w))))
      return {
        ...destination,
        best: Math.max(...scores),
        mean: scores.reduce((sum, s) => sum + s, 0) / scores.length,
      }
    })
    .filter(d => d.best >= 0.75)
    .sort((a, b) => b.best - a.best || b.mean - a.mean)
    .slice(0, 3)
})
</script>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .lost-tail {
    transform-origin: 50% 90%;
    animation: bob 7s ease-in-out infinite;
  }
  .swell {
    animation: drift 9s linear infinite;
  }
  .swell-slow {
    animation-duration: 14s;
    animation-direction: reverse;
  }
}

@keyframes bob {
  0%,
  100% {
    transform: translateY(0) rotate(-3deg);
  }
  50% {
    transform: translateY(5px) rotate(3deg);
  }
}

/* One full wavelength of the path, so the loop is seamless */
@keyframes drift {
  to {
    transform: translateX(-80px);
  }
}
</style>
