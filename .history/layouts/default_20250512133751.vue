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
        <button
          @click="toggleSpiritMode"
          :class="['ml-4 px-4 py-2 rounded transition', spiritMode ? 'bg-neon-pink/70 text-white ring-2 ring-neon-green/70 shadow-neon' : 'bg-ocean text-white hover:bg-ocean-dark']"
        >
          {{ spiritMode ? 'Spirit mode: ON' : 'Spirit mode' }}
        </button>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer :class="spiritMode ? 'bg-neon-pink/70 text-neon-green/90' : 'bg-ocean-dark text-white'" class="p-4 text-center mt-10">
      © 2025 Whalesome. Swim with care. 🐳
    </footer>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useHead } from '@unhead/vue'
import WhaleLogo from '~/components/WhaleLogo.vue'

const spiritMode = ref(false)

function toggleSpiritMode() {
  spiritMode.value = !spiritMode.value
}

watch(spiritMode, (val) => {
  useHead({
    bodyAttrs: {
      class: val ? 'spirit' : ''
    }
  })
}, { immediate: true })
</script>
