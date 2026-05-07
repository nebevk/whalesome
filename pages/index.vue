<template>
  <div class="min-h-screen">
    <!-- Hero Section - Surface -->
    <HomeHero />

    <!-- Whale Classification Tree - Mid Depth -->
    <WhaleTree />

    <!-- Featured Species Grid - Deep -->
    <SpeciesGrid />

    <!-- Conservation Section - Deepest -->
    <ConservationSection />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'HomePage' })

useSeoMeta({
  title: 'Whalesome — discover the world of whales',
  description: 'A quiet field guide to whales. Profiles, classification, and the conservation work keeping them around.',
  ogTitle: 'Whalesome',
  ogDescription: 'A quiet field guide to whales — profiles, classification, conservation.',
  twitterCard: 'summary_large_image',
})

// defineOgImage temporarily removed while bisecting hydration bug
</script>
