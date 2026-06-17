<template>
  <section class="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden">
    <div class="hero-media absolute inset-0 z-0">
      <video
        ref="videoEl"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
        :poster="posterUrl"
        aria-hidden="true"
        class="absolute inset-0 w-full h-full object-cover opacity-50"
      >
        <source :src="videoUrl" type="video/mp4" />
      </video>
      <!-- Tint follows the page gradient so the video blends into the descent,
           and stays translucent so the time-of-day theme shows through. -->
      <div class="absolute inset-0 bg-gradient-to-b from-[#5cb3e0]/20 via-[#1a6a9a]/40 to-[#0d456b]/70"></div>
    </div>
    <div class="relative z-10 px-6 max-w-4xl mx-auto">
      <h1
        class="brand-wordmark text-7xl md:text-9xl text-white drop-shadow-2xl mb-6 leading-none"
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
      <AnchorIcon class="h-7 w-7" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRightIcon } from '@heroicons/vue/24/outline'

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
/* Dissolve the video and its tint into the page gradient toward the bottom,
   so there is no hard edge where the hero meets the next section. */
.hero-media {
  -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 50%, transparent 92%);
  mask-image: linear-gradient(to bottom, #000 0%, #000 50%, transparent 92%);
}
</style>
