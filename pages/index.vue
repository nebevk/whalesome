<template>
  <div class="ocean-page relative isolate -mt-24 md:-mt-28">
    <!-- Time-of-day tint. A keyed layer per phase, crossfaded on change, so the
         ocean eases from one part of the day to the next instead of snapping. -->
    <Transition name="theme-fade">
      <div
        v-if="timeTheme"
        :key="phase"
        class="pointer-events-none absolute inset-0 -z-10"
        :style="{ background: gradient }"
        aria-hidden="true"
      />
    </Transition>

    <!-- Ambient bubbles + marine snow, faded in below the surface -->
    <ClientOnly>
      <OceanParticles />
    </ClientOnly>

    <div class="relative z-10">
      <!-- Hero Section - Surface -->
      <HomeHero />

      <!-- Whale of the day -->
      <WhaleOfDay />

      <!-- Whale Classification Tree - Mid Depth -->
      <WhaleTree />

      <!-- Featured Species Grid - Deep -->
      <SpeciesGrid />

      <!-- Conservation Section - Deepest -->
      <ConservationSection />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'HomePage' })

useSeoMeta({
  title: 'Whalesome, discover the world of whales',
  description: 'A quiet field guide to whales. Profiles, classification, population data, and the history of whaling.',
  ogTitle: 'Whalesome',
  ogDescription: 'A quiet field guide to whales: profiles, classification, conservation.',
  twitterCard: 'summary_large_image',
})

// When "follow time of day" is on, a tint layer re-colours the ocean to match
// the hour. The default surface-to-abyss gradient below shows when it is off.
const { timeTheme, gradient, phase } = useAmbient()
</script>

<style scoped>
/* One continuous descent: sunlit surface at the top, black abyss at the bottom.
   Each homepage section sits transparently on top of this single gradient. */
.ocean-page {
  background: linear-gradient(
    to bottom,
    #5cb3e0 0%,
    #3690c4 12%,
    #1a6a9a 24%,
    #0d456b 42%,
    #082a45 60%,
    #04162b 80%,
    #00060e 100%
  );
}

/* Crossfade between time-of-day tints (and on toggle on/off). */
.theme-fade-enter-active,
.theme-fade-leave-active {
  transition: opacity 5s ease;
}
.theme-fade-enter-from,
.theme-fade-leave-to {
  opacity: 0;
}
</style>
