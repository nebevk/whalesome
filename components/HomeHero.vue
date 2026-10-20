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
      <!-- A soft pool of deeper water behind the copy. Sized to the text block, so the
           edges of the hero stay sunlit, but dark enough that the lede keeps 4.5:1 even
           on the brightest frame of the video. -->
      <div
        class="hero-scrim pointer-events-none absolute -inset-x-10 -inset-y-8 -z-10 rounded-full"
        aria-hidden="true"
      />
      <h1
        class="brand-wordmark text-7xl md:text-9xl text-white drop-shadow-2xl mb-6 leading-none"
      >
        Whalesome
      </h1>
      <p
        class="hero-lede text-xl md:text-2xl lg:text-3xl text-white max-w-3xl mx-auto mb-10 leading-relaxed"
      >
        The deep is home to the largest animals that have ever lived. Learn who they are,
        how they live, and how to keep them here.
      </p>
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
      class="hero-cue absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70"
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

/* Deep-water navy, blurred into a soft pool. Worst case is a pure white video
   frame: at this strength the white lede still measures above 5:1. */
.hero-scrim {
  background: rgb(3 18 36 / 0.55);
  filter: blur(56px);
}

/* A faint halo gives the lede an edge against moving light. */
.hero-lede {
  text-shadow: 0 1px 2px rgb(3 18 36 / 0.45), 0 0 24px rgb(3 18 36 / 0.35);
}

/* The anchor drifts down and back, a slow cue to dive in. */
.hero-cue {
  animation: hero-cue-drift 3.6s ease-in-out infinite;
}

@keyframes hero-cue-drift {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  50% {
    transform: translateY(8px);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-cue {
    animation: none;
  }
}

@media (prefers-contrast: more) {
  .hero-scrim {
    background: rgb(3 18 36 / 0.75);
  }
}
</style>
