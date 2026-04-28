<template>
  <div>
    <transition name="fade">
      <header
        v-show="showHeader"
        class="navbar sticky top-0 z-50 bg-base-200 shadow-lg px-4 md:px-8"
      >
        <div class="navbar-start">
          <NuxtLink to="/" class="btn btn-ghost gap-2 px-2 text-xl font-whale">
            <WhaleLogo />
            Whalesome
          </NuxtLink>
        </div>

        <div class="navbar-end gap-2">
          <div class="hidden md:flex items-center gap-2">
            <NuxtLink to="/" class="btn btn-ghost btn-sm">Home</NuxtLink>
            <NuxtLink to="/species" class="btn btn-ghost btn-sm">Species</NuxtLink>
            <NuxtLink to="/about" class="btn btn-ghost btn-sm">About</NuxtLink>
          </div>

          <div class="dropdown dropdown-end md:hidden">
            <div tabindex="0" role="button" class="btn btn-ghost btn-square" aria-label="Open menu">
              <Bars3Icon class="h-6 w-6" />
            </div>
            <ul tabindex="0" class="dropdown-content menu bg-base-200 rounded-box z-50 mt-2 w-56 p-2 shadow-xl border border-base-300">
              <li><NuxtLink to="/" @click="closeDropdown">Home</NuxtLink></li>
              <li><NuxtLink to="/species" @click="closeDropdown">Species</NuxtLink></li>
              <li><NuxtLink to="/about" @click="closeDropdown">About</NuxtLink></li>
            </ul>
          </div>
        </div>
      </header>
    </transition>

    <main>
      <slot />
    </main>

    <footer class="footer p-10 bg-black text-gray-300">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto md:gap-12">
        <aside class="text-center md:text-left">
          <h6 class="footer-title text-gray-300">Whalesome</h6>
          <p class="max-w-xs">
            A quiet place to learn about whales, written in Nuxt and maintained as a personal
            sandbox.
          </p>
        </aside>
        <nav class="text-center md:text-left">
          <h6 class="footer-title text-gray-300">Explore</h6>
          <ul class="space-y-1">
            <li><NuxtLink to="/" class="link link-hover text-gray-400 hover:text-white">Home</NuxtLink></li>
            <li><NuxtLink to="/species" class="link link-hover text-gray-400 hover:text-white">Species</NuxtLink></li>
            <li><NuxtLink to="/about" class="link link-hover text-gray-400 hover:text-white">About</NuxtLink></li>
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
  </div>
</template>

<script setup lang="ts">
import WhaleLogo from '~/components/WhaleLogo.vue'

const showHeader = ref(true)

function handleScroll() {
  const scrollY = window.scrollY
  const windowHeight = window.innerHeight
  const bodyHeight = document.body.offsetHeight
  showHeader.value = windowHeight + scrollY < bodyHeight - 100
}

function closeDropdown() {
  if (import.meta.client) {
    (document.activeElement as HTMLElement | null)?.blur()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
