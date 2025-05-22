<template>
  <div class="bg-ocean-dark text-whale-blue min-h-screen">
    <!-- Hero Section -->
    <section class="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img 
          v-motion="'zoom-bg'"
          src="/assets/img/karl-heinz-muller-bMieozQvHeU-unsplash.jpg" 
          alt="Ocean background" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50"></div>
      </div>
      <div class="relative z-10 px-6">
        <h1 class="text-6xl md:text-7xl font-whale text-white drop-shadow-md mb-4">
          Whalesome
        </h1>
        <p class="text-xl md:text-2xl text-white max-w-2xl mb-8">
          Discover the majestic world of whales — their stories, species, and the deep connection we share with them.
        </p>
        <blockquote class="italic text-lg text-white max-w-xl border-l-4 border-white pl-4">
          "The whale is a creature of myth, of beauty, and of oceanic truth. To hear its song is to touch the soul of the sea."
        </blockquote>
      </div>
    </section>

    <!-- About Whales Section (Animated) -->
    <Motion
      tag="section"
      :initial="{ opacity: 0, y: 40 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 0.8 } }"
      class="py-20 px-6 bg-white text-center"
    >
      <div class="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <!-- Text Content -->
        <div class="text-left">
          <h2 class="text-4xl font-whale text-ocean-dark mb-4">About Whales</h2>
          <p class="text-lg text-whale-gray mb-6">
            Whales are among the largest and most intelligent creatures on Earth. These marine mammals communicate through complex vocalizations, migrate thousands of miles, and play a vital role in maintaining healthy ocean ecosystems. Despite their size, many species are endangered due to climate change, pollution, and whaling.
          </p>
          <NuxtLink 
            to="/species"
            class="inline-block px-6 py-3 bg-ocean-dark text-white font-semibold rounded-lg shadow hover:bg-ocean transition-colors"
          >
            View Whale Species
          </NuxtLink>
        </div>

        <!-- Whale Illustration -->
        <div class="flex justify-center">
          <img 
            v-motion
            :initial="{ opacity: 0 }"
            :enter="{ opacity: 1 }"
            :transition="{ duration: 1500, delay: 200 }"
            src="/assets/img/whale_tatoo.png"
            alt="Illustration of a whale"
            class="max-w-full h-auto w-80 md:w-96"
          />
        </div>
      </div>
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
// No imports needed as v-motion directive is globally available
</script>
