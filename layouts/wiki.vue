<template>
  <div class="min-h-screen bg-ocean-light">
    <!-- Header -->
    <header
      class="bg-ocean-dark text-white p-4 flex justify-between items-center"
    >
      <NuxtLink to="/" class="text-2xl font-whale flex items-center gap-2">
        <WhaleLogo />
        Whalesome
      </NuxtLink>
      <Menu as="nav" class="relative">
        <div class="hidden md:flex space-x-4 items-center">
          <NuxtLink to="/about">About</NuxtLink>
          <NuxtLink to="/species">Species</NuxtLink>
          <NuxtLink to="/wiki/framework">Wiki</NuxtLink>
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

    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 min-h-screen bg-white shadow-lg fixed left-0 top-16 p-6">
        <nav class="space-y-2">
          <NuxtLink 
            v-for="link in wikiLinks" 
            :key="link.path"
            :to="link.path"
            class="block p-3 rounded-lg transition-colors"
            :class="[
              isCurrentPage(link.path) 
                ? 'bg-ocean text-white' 
                : 'hover:bg-ocean-light text-whale-gray'
            ]"
          >
            <h3 class="font-semibold">{{ link.title }}</h3>
            <p class="text-sm" :class="{ 'text-white/80': isCurrentPage(link.path) }">
              {{ link.description }}
            </p>
          </NuxtLink>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 ml-64 p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import WhaleLogo from '~/components/WhaleLogo.vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ref, watch } from 'vue'

const route = useRoute()
const spiritMode = ref(false)

function toggleSpiritMode() {
  spiritMode.value = !spiritMode.value
}

watch(spiritMode, (val) => {
  if (typeof window !== 'undefined') {
    document.body.classList.toggle('spirit', val)
  }
}, { immediate: true })

const wikiLinks = [
  {
    title: 'Core Framework',
    description: 'Learn about Nuxt 3 and its features',
    path: '/wiki/framework'
  },
  {
    title: 'UI & Styling',
    description: 'Explore Tailwind CSS and Headless UI',
    path: '/wiki/styling'
  },
  {
    title: 'Animations',
    description: 'Discover VueUse Motion animations',
    path: '/wiki/animations'
  },
  {
    title: 'Deployment',
    description: 'Understand our Netlify setup',
    path: '/wiki/deployment'
  },
  {
    title: 'Future Plans',
    description: "See what's coming next",
    path: '/wiki/future'
  }
]

const isCurrentPage = (path: string) => {
  return route.path === path
}
</script>

<style scoped>
.font-whale {
  font-family: 'Whale', sans-serif;
}

.bg-ocean-light {
  background-color: #f0f7ff;
}

.bg-ocean {
  background-color: #2c5282;
}

.text-whale-blue {
  color: #1a365d;
}

.text-whale-gray {
  color: #4a5568;
}
</style> 