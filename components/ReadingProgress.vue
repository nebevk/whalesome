<template>
  <div class="fixed top-0 left-0 right-0 h-1 z-[60] pointer-events-none" aria-hidden="true">
    <div
      class="h-full bg-gradient-to-r from-primary via-secondary to-accent"
      :style="{ width: pct + '%' }"
    />
  </div>
</template>

<script setup lang="ts">
const pct = ref(0)

function onScroll() {
  const el = document.documentElement
  const max = el.scrollHeight - el.clientHeight
  pct.value = max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0
}

useEventListener(typeof window !== 'undefined' ? window : null, 'scroll', onScroll, { passive: true })
useEventListener(typeof window !== 'undefined' ? window : null, 'resize', onScroll, { passive: true })
onMounted(onScroll)
</script>
