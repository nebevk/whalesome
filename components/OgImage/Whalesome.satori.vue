<template>
  <div
    class="w-full h-full flex flex-col justify-between p-16"
    style="background: linear-gradient(135deg, #061624 0%, #0a223a 50%, #1a3a5c 100%); color: #e0f2fe; font-family: Merriweather;"
  >
    <div class="flex items-center gap-4">
      <div
        class="w-3 h-3 rounded-full"
        style="background: #00f0ff; box-shadow: 0 0 24px #00f0ff;"
      />
      <span class="text-2xl tracking-widest uppercase" style="color: #00f0ff;">
        Whalesome
      </span>
    </div>

    <div class="flex flex-col gap-6">
      <h1 class="text-7xl font-bold leading-tight">
        {{ title }}
      </h1>
      <p v-if="description" class="text-3xl leading-relaxed" style="color: rgba(224, 242, 254, 0.8);">
        {{ description }}
      </p>
    </div>

    <div class="flex items-end justify-between">
      <span class="text-xl" style="color: rgba(224, 242, 254, 0.6);">
        whalesome.netlify.app
      </span>
      <span
        class="text-2xl px-5 py-2 rounded-full"
        style="background: rgba(255, 62, 200, 0.15); color: #ff3ec8; border: 2px solid #ff3ec8;"
      >
        A field guide to whales
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
}>(), {
  title: 'Whalesome',
  description: 'Discover the world of whales, profiles, classification, conservation.',
})
</script>
