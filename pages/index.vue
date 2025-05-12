<template>
  <div class="bg-ocean-dark text-whale-blue min-h-screen">
    <!-- Hero Section -->
    <section class="flex flex-col items-center justify-center min-h-[60vh] bg-ocean-dark text-white">
      <h1 class="text-5xl font-whale mb-4">🐋 Welcome to Whalesome!</h1>
      <p class="text-lg text-whale-gray max-w-xl text-center">
        Dive into the world of whales—species, fun facts, and conservation efforts.
      </p>
      <NuxtLink
        to="/species"
        class="mt-6 px-4 py-2 bg-ocean text-white rounded-lg hover:bg-ocean-light"
      >
        Explore Whale Species
      </NuxtLink>
    </section>

    <!-- About Whales Section (Animated) -->
    <Motion
      tag="section"
      :initial="{ opacity: 0, y: 40 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 0.8 } }"
      class="py-20 bg-ocean text-white flex flex-col items-center"
    >
      <h2 class="text-3xl font-whale mb-2">About Whales</h2>
      <p class="max-w-2xl text-center text-whale-gray">
        Placeholder: Learn about the biology, intelligence, and social lives of whales.
      </p>
    </Motion>

    <!-- Featured Species Section -->
    <section class="py-20 bg-ocean-light text-white flex flex-col items-center">
      <h2 class="text-3xl font-whale mb-2">Featured Species</h2>
      <p class="max-w-2xl text-center text-whale-gray">
        Placeholder: Highlight a whale species with a fun fact or image.
      </p>
    </section>

    <!-- Conservation Tips Section -->
    <section class="py-20 bg-ocean-dark text-white flex flex-col items-center">
      <h2 class="text-3xl font-whale mb-2">Conservation Tips</h2>
      <p class="max-w-2xl text-center text-whale-gray">
        Placeholder: Share tips on how to help protect whales and oceans.
      </p>
    </section>

    <!-- Call to Action Section -->
    <section class="py-20 bg-ocean text-white flex flex-col items-center">
      <h2 class="text-3xl font-whale mb-2">Get Involved</h2>
      <p class="max-w-2xl text-center text-whale-gray">
        Placeholder: Invite users to join a newsletter, follow on social, or donate.
      </p>
    </section>
  </div>
</template>

<script setup>
</script>
