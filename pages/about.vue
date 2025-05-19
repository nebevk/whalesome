<template>
  <div class="min-h-screen bg-ocean-light text-whale-blue p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-5xl font-whale mb-6 text-center">🐳 About Whalesome</h1>
      
      <!-- Project Description -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 class="text-2xl font-whale mb-4">The Project</h2>
        <div class="prose max-w-none">
          <p class="text-lg text-whale-gray mb-4">
            Whalesome is dedicated to raising awareness about these magnificent
            marine mammals and their conservation.
          </p>
          <p class="text-lg text-whale-gray mb-4">
            Our mission is to educate and inspire people about the importance of
            whale conservation and marine ecosystem protection.
          </p>
          <p class="text-lg text-whale-gray italic">
            This project also serves as a playground for experimenting with modern web technologies and integrations.
          </p>
        </div>
      </div>

      <!-- About Me -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-whale mb-4">About Me</h2>
        <div class="prose max-w-none">
          <ContentDoc />
        </div>
      </div>

      <!-- Navigation -->
      <div class="text-center mt-8">
        <NuxtLink
          to="/"
          class="inline-block px-6 py-3 bg-ocean-dark text-white rounded-lg hover:bg-ocean transition-colors"
        >
          Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
.font-whale {
  font-family: 'Whale', sans-serif;
}

.bg-ocean-light {
  background-color: #f0f7ff;
}

.bg-ocean-dark {
  background-color: #1a365d;
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
