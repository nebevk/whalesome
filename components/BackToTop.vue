<template>
  <Transition name="rise">
    <div
      v-show="visible"
      class="tooltip tooltip-left fixed bottom-4 right-4 z-40 md:bottom-6 md:right-6"
      data-tip="Back to top"
    >
      <button
        type="button"
        class="group relative grid size-12 place-items-center rounded-full bg-base-200/80 text-base-content shadow-lg shadow-black/40 backdrop-blur-md transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label="Back to top"
        @click="toTop"
      >
        <!-- Depth gauge: the ring fills as you scroll further down the page -->
        <svg class="pointer-events-none absolute inset-0 -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="23" fill="none" stroke="currentColor" stroke-opacity="0.14" stroke-width="2" />
          <circle
            cx="24"
            cy="24"
            r="23"
            fill="none"
            class="text-primary"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            pathLength="100"
            stroke-dasharray="100"
            :stroke-dashoffset="100 - depth * 100"
          />
        </svg>
        <ArrowUpIcon class="h-5 w-5 motion-safe:transition-transform motion-safe:group-hover:-translate-y-0.5" />
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ArrowUpIcon } from '@heroicons/vue/24/outline'

const visible = ref(false)
/** 0 at the top of the page, 1 at the bottom. */
const depth = ref(0)
const motion = usePreferredReducedMotion()

let frame = 0
function measure() {
  frame = 0
  const max = document.documentElement.scrollHeight - window.innerHeight
  visible.value = window.scrollY > 600
  depth.value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
}
function onScroll() {
  if (!frame) frame = requestAnimationFrame(measure)
}

function toTop() {
  window.scrollTo({ top: 0, behavior: motion.value === 'reduce' ? 'auto' : 'smooth' })
  // Move keyboard focus up too, so the next Tab continues from the top of the
  // content instead of from this button, which hides once the page is at the top.
  document.getElementById('main-content')?.focus({ preventScroll: true })
}

useEventListener(import.meta.client ? window : null, 'scroll', onScroll, { passive: true })
useEventListener(import.meta.client ? window : null, 'resize', onScroll, { passive: true })
onMounted(measure)
onBeforeUnmount(() => {
  if (frame) cancelAnimationFrame(frame)
})
</script>

<style scoped>
.rise-enter-active,
.rise-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.rise-enter-from,
.rise-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (prefers-reduced-motion: reduce) {
  .rise-enter-active,
  .rise-leave-active {
    transition: opacity 0.25s ease;
  }
  .rise-enter-from,
  .rise-leave-to {
    transform: none;
  }
}
</style>
