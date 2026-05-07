<template>
  <div class="min-h-screen bg-base-100 flex items-center justify-center px-6">
    <div class="max-w-xl text-center">
      <div class="text-9xl font-whale text-primary mb-4 select-none">
        {{ statusCode }}
      </div>
      <h1 class="text-3xl md:text-4xl font-whale mb-4">{{ title }}</h1>
      <p class="text-base-content/70 mb-8">{{ message }}</p>
      <div class="flex flex-wrap justify-center gap-3">
        <button class="btn btn-primary" @click="handleHome">
          <HomeIcon class="h-5 w-5" />
          Back home
        </button>
        <NuxtLink to="/species" class="btn btn-ghost" @click="handleError">
          Browse species
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HomeIcon } from '@heroicons/vue/24/outline'

interface Props {
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
  }
}

const props = defineProps<Props>()

const statusCode = computed(() => props.error.statusCode || 500)
const title = computed(() => {
  if (statusCode.value === 404) return 'Lost at sea'
  if (statusCode.value >= 500) return 'Something broke below the surface'
  return props.error.statusMessage || 'Something went wrong'
})
const message = computed(() => {
  if (statusCode.value === 404) {
    return "The page you were looking for has drifted away. The whales are unbothered."
  }
  return props.error.message || "An unexpected error occurred. Try again, or head somewhere else."
})

useHead({ htmlAttrs: { 'data-theme': 'spirit' } })
useSeoMeta({
  title: `${statusCode.value} — Whalesome`,
})

function handleError() {
  clearError()
}

function handleHome() {
  clearError({ redirect: '/' })
}
</script>
