<template>
  <div
    class="w-full h-full flex flex-row"
    style="background: linear-gradient(135deg, #061624 0%, #0a223a 50%, #1a3a5c 100%); color: #e0f2fe; font-family: Merriweather;"
  >
    <div v-if="image" class="w-1/2 h-full">
      <img
        :src="image"
        class="w-full h-full object-cover"
        style="filter: saturate(0.9);"
      />
    </div>

    <div class="flex-1 flex flex-col justify-between p-14">
      <div class="flex items-center gap-3">
        <div
          class="w-3 h-3 rounded-full"
          style="background: #00f0ff; box-shadow: 0 0 24px #00f0ff;"
        />
        <span class="text-xl tracking-widest uppercase" style="color: #00f0ff;">
          Whalesome
        </span>
      </div>

      <div class="flex flex-col gap-3">
        <h1 class="text-6xl font-bold leading-tight">
          {{ name }}
        </h1>
        <p v-if="scientificName" class="text-2xl italic" style="color: rgba(224, 242, 254, 0.7);">
          {{ scientificName }}
        </p>
        <p v-if="description" class="text-xl mt-3 leading-relaxed" style="color: rgba(224, 242, 254, 0.85);">
          {{ description }}
        </p>
      </div>

      <div class="flex items-center gap-3 flex-wrap">
        <span
          v-if="status"
          class="text-base px-4 py-2 rounded-full"
          style="background: rgba(0, 240, 255, 0.15); color: #00f0ff; border: 2px solid #00f0ff;"
        >
          {{ status }}
        </span>
        <span
          v-if="group"
          class="text-base px-4 py-2 rounded-full"
          style="background: rgba(255, 62, 200, 0.15); color: #ff3ec8; border: 2px solid #ff3ec8;"
        >
          {{ group }} whale
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  name?: string
  scientificName?: string
  description?: string
  status?: string
  group?: string
  image?: string
}>(), {
  name: 'Whale',
  scientificName: '',
  description: '',
  status: '',
  group: '',
  image: '',
})
</script>
