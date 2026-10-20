<template>
  <div>
    <!-- First tab stop: lets keyboard users jump past the nav to the page itself -->
    <a
      href="#main-content"
      class="btn btn-primary btn-sm fixed left-4 top-3 z-[70] -translate-y-[200%] rounded-full shadow-lg focus:translate-y-0 motion-safe:transition-transform"
      @click.prevent="skipToContent"
    >
      Skip to content
    </a>

    <!-- Floating glass navigation, detached from the top edge, always visible.
         Icon buttons are 44px for touch and shrink to 32px on desktop with a mouse. -->
    <div class="sticky top-0 z-50 px-3 pt-3 md:px-6 md:pt-5">
      <header
        class="navbar min-h-0 mx-auto max-w-6xl rounded-2xl border border-white/10 bg-base-200/55 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(2,8,20,0.7)] px-3 py-1.5 md:px-5 lg:pointer-fine:py-2"
      >
        <div class="navbar-start">
          <NuxtLink
            to="/"
            class="brand-wordmark rounded-lg text-3xl md:text-4xl text-white leading-none px-2 pb-1 transition-transform hover:scale-105"
          >
            Whalesome
          </NuxtLink>
        </div>

        <div class="navbar-end gap-1">
          <nav class="hidden lg:flex items-center gap-0.5" aria-label="Main">
            <NuxtLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              :aria-current="linkState(link.to)"
              class="btn btn-ghost btn-sm relative rounded-lg font-normal"
              :class="linkState(link.to) ? desktopActive : 'hover:bg-white/[0.06]'"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>

          <!-- Tools, set apart from the page links -->
          <div class="hidden lg:block mx-1.5 h-5 w-px bg-white/15" aria-hidden="true" />

          <button
            type="button"
            class="btn btn-ghost btn-circle size-11 lg:pointer-fine:h-8 lg:pointer-fine:w-auto lg:pointer-fine:gap-1.5 lg:pointer-fine:px-2.5"
            aria-label="Find a whale"
            title="Find a whale (press /)"
            aria-haspopup="dialog"
            aria-keyshortcuts="/ Control+K Meta+K"
            @click="openQuickFind"
          >
            <MagnifyingGlassIcon class="h-5 w-5" />
            <kbd class="kbd kbd-xs hidden lg:pointer-fine:inline-flex" aria-hidden="true">/</kbd>
          </button>

          <AmbientControl />

          <nav
            ref="menuRoot"
            class="dropdown dropdown-end lg:hidden"
            :class="menuOpen ? 'dropdown-open' : 'dropdown-close'"
            aria-label="Main"
            @keydown="onMenuKeydown"
          >
            <button
              ref="menuTrigger"
              type="button"
              class="btn btn-ghost btn-circle size-11"
              aria-label="Menu"
              :aria-expanded="menuOpen"
              :aria-controls="menuId"
              @click="toggleMenu"
            >
              <XMarkIcon v-if="menuOpen" class="h-6 w-6" />
              <Bars3Icon v-else class="h-6 w-6" />
            </button>
            <ul
              :id="menuId"
              class="dropdown-content menu mt-3 w-60 rounded-2xl border border-white/10 bg-base-200/95 p-2 shadow-xl backdrop-blur"
            >
              <li v-for="link in links" :key="link.to">
                <!-- DaisyUI's menu swaps the focus ring for a tint that would match the
                     current-page tint, so bring a real ring back for keyboard users. -->
                <NuxtLink
                  :to="link.to"
                  :aria-current="linkState(link.to)"
                  class="gap-3 rounded-xl py-3 active:bg-white/15 focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                  :class="linkState(link.to) ? 'bg-white/10 text-white' : ''"
                  @click="closeMenu()"
                >
                  <component
                    :is="link.icon"
                    class="h-5 w-5"
                    :class="linkState(link.to) ? 'text-primary' : 'text-base-content/60'"
                  />
                  {{ link.label }}
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>

    <main id="main-content" tabindex="-1" class="outline-none">
      <slot />
    </main>

    <footer class="footer p-10 bg-black text-gray-300">
      <div class="grid grid-cols-1 justify-items-stretch gap-10 w-full max-w-5xl mx-auto md:grid-cols-3 md:gap-12">
        <div class="text-center md:text-left">
          <p class="brand-wordmark text-4xl text-white mb-2">Whalesome</p>
          <p class="max-w-xs mx-auto md:mx-0">
            A quiet place to learn about whales, written in Nuxt and maintained as a personal
            sandbox.
          </p>
          <p class="mt-6 text-xs text-gray-400">Enjoying the site?</p>
          <a
            href="https://ko-fi.com/nejcbevk"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-2 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 text-sm text-gray-200 transition-colors hover:border-secondary/60 hover:bg-secondary/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary md:min-h-9"
          >
            <HeartIcon class="h-4 w-4 text-secondary" />
            Support Whalesome on Ko-fi
            <span class="sr-only">(opens in a new tab)</span>
          </a>
        </div>
        <nav class="text-center md:text-left" aria-label="Footer">
          <h2 class="footer-title text-gray-400 opacity-100">Explore</h2>
          <ul class="space-y-1">
            <li v-for="link in links" :key="link.to">
              <NuxtLink :to="link.to" class="link link-hover inline-flex py-1 text-gray-400 hover:text-white">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <div class="text-center md:text-left">
          <h2 class="footer-title text-gray-400 opacity-100">Credits</h2>
          <ul class="space-y-1">
            <li v-for="credit in credits" :key="credit.href">
              <a
                :href="credit.href"
                class="link link-hover inline-flex items-center gap-1 py-1 text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ credit.label }}
                <ArrowUpRightIcon class="h-3 w-3 opacity-70" />
                <span class="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="w-full max-w-5xl mx-auto border-t border-gray-800 mt-8 pt-6 flex flex-col items-center gap-2 text-sm text-gray-400 sm:flex-row sm:justify-between">
        <p>&copy; {{ year }} Whalesome. Swim with care.</p>
        <p class="hidden items-center gap-1.5 pointer-fine:flex">
          Press <kbd class="kbd kbd-xs">/</kbd> to find a whale
        </p>
      </div>
    </footer>

    <BackToTop />
    <QuickFind :pages="links" />
    <NuxtRouteAnnouncer />
  </div>
</template>

<script setup lang="ts">
import {
  ArrowUpRightIcon,
  Bars3Icon,
  BookOpenIcon,
  ChartBarIcon,
  CubeTransparentIcon,
  HeartIcon,
  HomeIcon,
  IdentificationIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  ScaleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

// One list drives the desktop nav, the mobile menu, the footer, and quick find.
const links = [
  { to: '/', label: 'Home', icon: HomeIcon, blurb: 'From the surface to the abyss, plus the whale of the day', keywords: 'start classification tree conservation whale of the day' },
  { to: '/species', label: 'Species', icon: IdentificationIcon, blurb: 'Every profile, with search and filters', keywords: 'all browse list profiles baleen toothed' },
  { to: '/anatomy', label: 'Anatomy', icon: CubeTransparentIcon, blurb: 'How whales work, as interactive figures', keywords: 'echolocation sonar melon click echo how whales work figure interactive' },
  { to: '/history', label: 'History', icon: BookOpenIcon, blurb: 'The age of whaling, a sourced timeline', keywords: 'whaling timeline moratorium hunting' },
  { to: '/populations', label: 'Numbers', icon: ChartBarIcon, blurb: 'Whales by the numbers', keywords: 'populations statistics estimates recovery data red list' },
  { to: '/compare', label: 'Compare', icon: ScaleIcon, blurb: 'Any two whales, side by side', keywords: 'versus size scale side by side' },
  { to: '/about', label: 'About', icon: InformationCircleIcon, blurb: 'Why Whalesome exists', keywords: 'credits built with colophon' },
]

const credits = [
  { label: 'Photography via Unsplash', href: 'https://unsplash.com' },
  { label: 'Galleries via Wikimedia Commons', href: 'https://commons.wikimedia.org' },
  { label: 'Figures built with the Anatomy kit', href: 'https://github.com/wheresryan22/anatomy' },
  { label: 'Logo by VectorStock / SeptionDigital', href: 'https://www.vectorstock.com/royalty-free-vector/abstract-whale-tattoo-silhouette-with-wave-accent-vector-47585302' },
  { label: 'Built by Nejc Bevk', href: 'https://nejcbevk.com' },
]

// ---- Current page ----
const route = useRoute()
const error = useError()
const currentPath = computed(() => route.path.replace(/\/+$/, '') || '/')

/**
 * "page" for the link to the page you are on, "true" for its section (Species
 * while reading a species profile), nothing otherwise. Nothing is current on
 * the error page, even though the router may still hold the previous route.
 */
function linkState(to: string): 'page' | 'true' | undefined {
  if (error.value) return undefined
  if (currentPath.value === to) return 'page'
  if (to !== '/' && currentPath.value.startsWith(`${to}/`)) return 'true'
  return undefined
}

// A soft glass pill with a short glowing underline: visible, but not loud.
const desktopActive = 'bg-white/10 text-white after:absolute after:bottom-0.5 after:left-1/2 after:h-0.5 after:w-4 after:-translate-x-1/2 after:rounded-full after:bg-primary after:shadow-[0_0_8px_var(--color-primary)]'

// ---- Mobile menu ----
const menuRoot = ref<HTMLElement | null>(null)
const menuTrigger = ref<HTMLElement | null>(null)
const { open: menuOpen, toggle: toggleMenu, close: closeMenu, onKeydown: onMenuKeydown } = useDisclosure(menuRoot, menuTrigger)
const menuId = useId()

// ---- Quick find and skip link ----
const { open: openQuickFind } = useQuickFind()

function skipToContent() {
  document.getElementById('main-content')?.focus()
}

// Resolved once on the server and reused on hydration, so the year never mismatches.
const year = useState('footer:year', () => new Date().getFullYear())
</script>
