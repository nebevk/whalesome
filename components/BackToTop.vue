<template>
  <Transition name="rise">
    <button
      v-show="visible"
      type="button"
      class="btn btn-circle btn-primary fixed bottom-6 right-6 z-40 shadow-lg shadow-primary/20"
      aria-label="Back to top"
      title="Back to top"
      @click="toTop"
    >
      <AnchorIcon class="h-5 w-5" />
    </button>
  </Transition>
</template>

<script setup lang="ts">
const visible = ref(false)
const motion = usePreferredReducedMotion()

function onScroll() {
  visible.value = window.scrollY > 600
}
function toTop() {
  window.scrollTo({ top: 0, behavior: motion.value === 'reduce' ? 'auto' : 'smooth' })
}

useEventListener(typeof window !== 'undefined' ? window : null, 'scroll', onScroll, { passive: true })
onMounted(onScroll)
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
</style>
