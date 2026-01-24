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
          <!-- Desktop: links + theme -->
          <div class="hidden md:flex items-center gap-2">
            <NuxtLink to="/" class="btn btn-ghost btn-sm">Home</NuxtLink>
            <NuxtLink to="/about" class="btn btn-ghost btn-sm">About</NuxtLink>
            <NuxtLink to="/species" class="btn btn-ghost btn-sm">Species</NuxtLink>
            <div class="divider divider-horizontal mx-1"></div>
            <ThemeSwitcher />
          </div>

          <!-- Mobile: dropdown menu -->
          <div class="dropdown dropdown-end md:hidden">
            <div tabindex="0" role="button" class="btn btn-ghost btn-square" aria-label="Open menu">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <ul tabindex="0" class="dropdown-content menu bg-base-200 rounded-box z-50 mt-2 w-56 p-2 shadow-xl border border-base-300">
              <li><NuxtLink to="/" @click="closeDropdown">Home</NuxtLink></li>
              <li><NuxtLink to="/about" @click="closeDropdown">About</NuxtLink></li>
              <li><NuxtLink to="/species" @click="closeDropdown">Species</NuxtLink></li>
              <li><div class="pt-2 mt-2 border-t border-base-300"><ThemeSwitcher /></div></li>
            </ul>
          </div>
        </div>
      </header>
    </transition>

    <main>
      <slot />
    </main>

    <footer class="footer p-10 bg-black text-gray-300">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto md:gap-12">
        <aside class="text-center md:text-left md:pr-8 md:border-r md:border-gray-700">
          <h6 class="footer-title text-gray-300">Copyright</h6>
          <p>
            © {{ new Date().getFullYear() }} Whalesome, from
            <a href="https://nejcbevk.com" class="link link-hover text-info hover:text-info/90" target="_blank" rel="noopener noreferrer">Nejc Bevk</a>.
            Swim with care. 🐳
          </p>
        </aside>
        <nav class="text-center md:text-left md:pl-8">
          <h6 class="footer-title text-gray-300">Attributions</h6>
          <ul class="space-y-1">
            <li>
              <a
                href="https://unsplash.com"
                class="link link-hover text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Photos via Unsplash
              </a>
            </li>
            <li>
              <a
                href="https://www.vectorstock.com/royalty-free-vector/abstract-whale-tattoo-silhouette-with-wave-accent-vector-47585302"
                class="link link-hover text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vector image by VectorStock / SeptionDigital
              </a>
            </li>
          </ul>
        </nav>
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
  if (process.client) {
    const active = document.activeElement as HTMLElement
    active?.blur()
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
