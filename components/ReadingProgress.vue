<template>
  <div class="fixed top-0 left-0 right-0 h-1 z-[60] pointer-events-none" aria-hidden="true">
    <!-- scaleX rather than width, so scrolling never triggers layout -->
    <div
      class="h-full origin-left bg-gradient-to-r from-primary via-secondary to-accent"
      :style="{ transform: `scaleX(${progress})` }"
    />
  </div>
</template>

<script setup lang="ts">
/** 0 at the top of the page, 1 at the bottom. */
const progress = ref(0)

let frame = 0
function measure() {
  frame = 0
  const el = document.documentElement
  const max = el.scrollHeight - el.clientHeight
  progress.value = max > 0 ? Math.min(1, el.scrollTop / max) : 0
}
function onScroll() {
  if (!frame) frame = requestAnimationFrame(measure)
}

useEventListener(import.meta.client ? window : null, 'scroll', onScroll, { passive: true })
useEventListener(import.meta.client ? window : null, 'resize', onScroll, { passive: true })
onMounted(measure)
onBeforeUnmount(() => {
  if (frame) cancelAnimationFrame(frame)
})
</script>
