<template>
  <div>
    <!-- Floating glass navigation, detached from the top edge, always visible -->
    <div class="sticky top-0 z-50 px-3 pt-3 md:px-6 md:pt-5">
      <header
        class="navbar min-h-0 mx-auto max-w-6xl rounded-2xl border border-white/10 bg-base-200/55 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(2,8,20,0.7)] px-3 py-2 md:px-5"
      >
        <div class="navbar-start">
          <NuxtLink
            to="/"
            class="brand-wordmark text-3xl md:text-4xl text-white leading-none px-2 pb-1 transition-transform hover:scale-105"
          >
            Whalesome
          </NuxtLink>
        </div>

        <div class="navbar-end gap-1">
          <nav class="hidden lg:flex items-center gap-0.5">
            <NuxtLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="btn btn-ghost btn-sm rounded-lg font-normal"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>

          <!-- Separate ambient control, set apart from the page links -->
          <div class="hidden lg:block mx-1.5 h-5 w-px bg-white/15" aria-hidden="true" />
          <AmbientControl />

          <div class="dropdown dropdown-end lg:hidden">
            <div tabindex="0" role="button" class="btn btn-ghost btn-square btn-sm" aria-label="Open menu">
              <Bars3Icon class="h-6 w-6" />
            </div>
            <ul
              tabindex="0"
              class="dropdown-content menu bg-base-200/95 backdrop-blur rounded-box z-50 mt-3 w-56 p-2 shadow-xl border border-white/10"
            >
              <li v-for="link in links" :key="link.to">
                <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </div>

    <main>
      <slot />
    </main>

    <footer class="footer p-10 bg-black text-gray-300">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto md:gap-12">
        <aside class="text-center md:text-left">
          <p class="brand-wordmark text-4xl text-white mb-2">Whalesome</p>
          <p class="max-w-xs">
            A quiet place to learn about whales, written in Nuxt and maintained as a personal
            sandbox.
          </p>
        </aside>
        <nav class="text-center md:text-left">
          <h6 class="footer-title text-gray-300">Explore</h6>
          <ul class="space-y-1">
            <li v-for="link in links" :key="link.to">
              <NuxtLink :to="link.to" class="link link-hover text-gray-400 hover:text-white">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </nav>
        <nav class="text-center md:text-left">
          <h6 class="footer-title text-gray-300">Credits</h6>
          <ul class="space-y-1">
            <li>
              <a
                href="https://unsplash.com"
                class="link link-hover text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Photography via Unsplash
              </a>
            </li>
            <li>
              <a
                href="https://commons.wikimedia.org"
                class="link link-hover text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Galleries via Wikimedia Commons
              </a>
            </li>
            <li>
              <a
                href="https://www.vectorstock.com/royalty-free-vector/abstract-whale-tattoo-silhouette-with-wave-accent-vector-47585302"
                class="link link-hover text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Logo by VectorStock / SeptionDigital
              </a>
            </li>
            <li>
              <a
                href="https://nejcbevk.com"
                class="link link-hover text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Built by Nejc Bevk
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div class="w-full max-w-5xl mx-auto border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
        &copy; {{ new Date().getFullYear() }} Whalesome. Swim with care.
      </div>
    </footer>

    <BackToTop />
  </div>
</template>

<script setup lang="ts">
import { Bars3Icon } from '@heroicons/vue/24/outline'

const links = [
  { to: '/', label: 'Home' },
  { to: '/species', label: 'Species' },
  { to: '/history', label: 'History' },
  { to: '/populations', label: 'Numbers' },
  { to: '/compare', label: 'Compare' },
  { to: '/about', label: 'About' },
]
</script>
