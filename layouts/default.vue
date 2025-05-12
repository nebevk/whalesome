<template>
  <div>
    <header
      class="bg-ocean-dark text-white p-4 flex justify-between items-center"
    >
      <NuxtLink to="/" class="text-2xl font-whale flex items-center gap-2">
        <WhaleLogo />
        Whalesome
      </NuxtLink>
      <nav class="space-x-4 flex items-center">
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
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer :class="spiritMode ? 'bg-neon-pink/80 text-neon-blue/90' : 'bg-ocean-dark text-white'" class="p-4 text-center mt-10">
      © 2025 Whalesome. Swim with care. 🐳
    </footer>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import WhaleLogo from '~/components/WhaleLogo.vue'

const spiritMode = ref(false)

function toggleSpiritMode() {
  spiritMode.value = !spiritMode.value
}

watch(spiritMode, (val) => {
  if (typeof window !== 'undefined') {
    document.body.classList.toggle('spirit', val)
  }
}, { immediate: true })
</script>
