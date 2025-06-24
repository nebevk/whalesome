<template>
  <div>
    <transition name="fade">
      <header
        v-show="showHeader"
        class="sticky top-4 z-50 mx-4 md:mx-8 rounded-2xl bg-ocean-dark/80 backdrop-blur-md border border-white/10 text-white p-4 flex justify-between items-center header-glow"
      >
        <NuxtLink to="/" class="text-2xl font-whale flex items-center gap-2">
          <WhaleLogo />
          Whalesome
        </NuxtLink>
        <Menu as="nav" class="relative">
          <div class="hidden md:flex space-x-4 items-center">
            <NuxtLink to="/about">About</NuxtLink>
            <NuxtLink to="/species">Species</NuxtLink>
            <div class="ml-4 flex items-center gap-2">
              <span class="text-sm">Spirit mode</span>
              <button
                @click="toggleSpiritMode"
                class="relative w-12 h-6 rounded-full transition focus:outline-none"
                :class="spiritMode ? 'bg-neon-pink/80 shadow-neon' : 'bg-gray-700'"
                aria-label="Toggle Spirit mode"
              >
                <span
                  class="absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-300"
                  :class="spiritMode ? 'translate-x-6 bg-neon-blue/90' : 'bg-white'"
                ></span>
              </button>
            </div>
          </div>
          <div class="md:hidden flex items-center">
            <MenuButton class="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span class="sr-only">Open main menu</span>
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </MenuButton>
            <MenuItems class="absolute right-0 mt-2 w-48 origin-top-right bg-white text-whale-blue rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div class="py-1">
                <MenuItem v-slot="{ active }">
                  <NuxtLink :class="[active ? 'bg-ocean-light' : '', 'block px-4 py-2']" to="/about">About</NuxtLink>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <NuxtLink :class="[active ? 'bg-ocean-light' : '', 'block px-4 py-2']" to="/species">Species</NuxtLink>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <NuxtLink :class="[active ? 'bg-ocean-light' : '', 'block px-4 py-2']" to="/wiki/framework">Wiki</NuxtLink>
                </MenuItem>
                <MenuItem v-slot>
                  <div class="flex items-center gap-2 px-4 py-2">
                    <span class="text-sm">Spirit mode</span>
                    <button
                      @click="toggleSpiritMode"
                      class="relative w-12 h-6 rounded-full transition focus:outline-none"
                      :class="spiritMode ? 'bg-neon-pink/80 shadow-neon' : 'bg-gray-700'"
                      aria-label="Toggle Spirit mode"
                    >
                      <span
                        class="absolute left-1 top-1 w-4 h-4 rounded-full transition-transform duration-300"
                        :class="spiritMode ? 'translate-x-6 bg-neon-blue/90' : 'bg-white'"
                      ></span>
                    </button>
                  </div>
                </MenuItem>
              </div>
            </MenuItems>
          </div>
        </Menu>
      </header>
    </transition>
    <main>
      <slot />
    </main>
    <footer :class="spiritMode ? 'bg-neon-pink/80 text-neon-blue/90' : 'bg-ocean-dark text-white'" class="py-8">
      <div class="max-w-5xl mx-auto px-6">
        <div class="text-center mb-4">
          © {{ new Date().getFullYear() }} Whalesome, from <a href="https://nejcbevk.com" class="hover:text-neon-blue transition-colors">Nejc Bevk</a>. Swim with care. 🐳
        </div>
        <div class="text-sm text-whale-gray">
          <h3 class="text-lg font-semibold mb-2">Attributions</h3>
          <ul class="space-y-1">
            <li>
              <a href="https://www.vectorstock.com/royalty-free-vector/abstract-whale-tattoo-silhouette-with-wave-accent-vector-47585302" 
                 class="hover:text-white transition-colors"
                 target="_blank"
                 rel="noopener noreferrer">
                Vector image by VectorStock / SeptionDigital
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import WhaleLogo from '~/components/WhaleLogo.vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

const spiritMode = ref(false)
const showHeader = ref(true)

function toggleSpiritMode() {
  spiritMode.value = !spiritMode.value
}

function handleScroll() {
  const scrollY = window.scrollY
  const windowHeight = window.innerHeight
  const bodyHeight = document.body.offsetHeight
  // Hide header if within 100px of bottom
  showHeader.value = (windowHeight + scrollY) < (bodyHeight - 100)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(spiritMode, (val) => {
  if (typeof window !== 'undefined') {
    document.body.classList.toggle('spirit', val)
  }
}, { immediate: true })
</script>

<style scoped>
.bg-ocean-light {
  background-color: #f0f7ff;
}

header {
      margin-top: -4.5rem;
}

.header-glow {
  box-shadow: 0 5px 8px 0 rgba(184, 221, 250, 0.089);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
