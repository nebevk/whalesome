<template>
  <section class="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden ocean-depth-surface">
    <div class="absolute inset-0 z-0">
      <video
        ref="videoEl"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
        :poster="posterUrl"
        aria-hidden="true"
        class="absolute inset-0 w-full h-full object-cover"
      >
        <source :src="videoUrl" type="video/mp4" />
      </video>
      <div class="absolute inset-0 bg-gradient-to-b from-blue-900/30 via-blue-950/50 to-black/70"></div>
    </div>
    <div class="relative z-10 px-6 max-w-4xl mx-auto">
      <h1
        class="text-6xl md:text-8xl font-whale text-white drop-shadow-2xl mb-6"
      >
        Whalesome
      </h1>
      <p
        class="text-xl md:text-2xl lg:text-3xl text-white/95 max-w-3xl mb-8 leading-relaxed"
      >
        The deep is home to the largest animals that have ever lived. Learn who they are,
        how they live, and how to keep them here.
      </p>
      <blockquote
        class="italic text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto border-l-4 border-white/60 pl-6 py-4 mb-10"
      >
        "The whale is a creature of myth, of beauty, and of oceanic truth.
        To hear its song is to touch the soul of the sea."
      </blockquote>
      <div
        class="flex flex-wrap justify-center gap-4"
      >
        <NuxtLink to="/species" class="btn btn-primary btn-lg">
          Browse species
          <ArrowRightIcon class="h-5 w-5" />
        </NuxtLink>
        <a href="#classification" class="btn btn-ghost btn-lg text-white border-white/40 hover:bg-white/10">
          Explore the tree
        </a>
      </div>
    </div>
    <div
      class="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 animate-bounce"
      aria-hidden="true"
    >
      <ChevronDoubleDownIcon class="h-6 w-6" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRightIcon, ChevronDoubleDownIcon } from '@heroicons/vue/24/outline'

const videoUrl = '/vid/bg_video.mp4'
const posterUrl = '/img/karl-heinz-muller-bMieozQvHeU-unsplash.jpg'

const videoEl = ref<HTMLVideoElement | null>(null)
const motionPref = usePreferredReducedMotion()

watchEffect(() => {
  if (!videoEl.value) return
  if (motionPref.value === 'reduce') {
    videoEl.value.pause()
  }
  else if (videoEl.value.paused) {
    videoEl.value.play().catch(() => {})
  }
})
</script>

<style scoped>
.ocean-depth-surface {
  background: linear-gradient(to bottom,
    rgba(135, 206, 250, 0.1) 0%,
    rgba(70, 130, 180, 0.2) 50%,
    rgba(25, 25, 112, 0.3) 100%
  );
}
</style>
