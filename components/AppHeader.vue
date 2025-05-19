<template>
  <header class="bg-white shadow-lg">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <NuxtLink to="/" class="flex items-center">
            <span class="text-2xl font-whale text-whale-blue">Whalesome</span>
          </NuxtLink>
        </div>
        
        <div class="flex items-center space-x-4">
          <NuxtLink 
            to="/" 
            class="text-whale-gray hover:text-whale-blue px-3 py-2 rounded-md text-sm font-medium"
            :class="{ 'text-whale-blue': isCurrentPage('/') }"
          >
            Home
          </NuxtLink>
          <NuxtLink 
            to="/about" 
            class="text-whale-gray hover:text-whale-blue px-3 py-2 rounded-md text-sm font-medium"
            :class="{ 'text-whale-blue': isCurrentPage('/about') }"
          >
            About
          </NuxtLink>
          <NuxtLink 
            to="/wiki/framework" 
            class="text-whale-gray hover:text-whale-blue px-3 py-2 rounded-md text-sm font-medium"
            :class="{ 'text-whale-blue': isCurrentPage('/wiki') }"
          >
            Wiki
          </NuxtLink>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const isCurrentPage = (path: string) => {
  return route.path.startsWith(path)
}
</script>

<style scoped>
.font-whale {
  font-family: 'Whale', sans-serif;
}

.text-whale-blue {
  color: #1a365d;
}

.text-whale-gray {
  color: #4a5568;
}
</style> 