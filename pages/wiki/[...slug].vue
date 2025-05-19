<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <Content :path="contentPath" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const contentPath = computed(() => {
  const slug = route.params.slug as string[]
  return `/wiki/${slug.join('/')}`
})

// Set the layout for this page
definePageMeta({
  layout: 'wiki'
})
</script>

<style scoped>
/* Content styling */
:deep(h1) {
  @apply text-3xl font-whale mb-6;
}

:deep(h2) {
  @apply text-2xl font-whale mb-4;
}

:deep(h3) {
  @apply text-xl font-semibold mb-3;
}

:deep(p) {
  @apply mb-4 text-whale-gray;
}

:deep(ul) {
  @apply list-disc list-inside mb-4 text-whale-gray;
}

:deep(code) {
  @apply bg-gray-100 px-2 py-1 rounded;
}

:deep(pre) {
  @apply bg-gray-100 p-4 rounded-lg mb-4 overflow-x-auto;
}

:deep(pre code) {
  @apply bg-transparent p-0;
}
</style> 