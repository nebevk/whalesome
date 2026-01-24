<template>
  <section class="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden ocean-depth-surface">
    <div class="absolute inset-0 z-0">
      <img 
        v-motion="'zoom-bg'"
        src="/assets/img/karl-heinz-muller-bMieozQvHeU-unsplash.jpg" 
        alt="Ocean background" 
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-blue-200/30 via-blue-400/40 to-blue-900/60"></div>
    </div>
    <div class="relative z-10 px-6 max-w-4xl mx-auto">
      <h1 
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 1, delay: 0.2 } }"
        class="text-6xl md:text-8xl font-whale text-white drop-shadow-2xl mb-6"
      >
        Whalesome
      </h1>
      <p 
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 1, delay: 0.4 } }"
        class="text-xl md:text-2xl lg:text-3xl text-white/95 max-w-3xl mb-8 leading-relaxed"
      >
        Discover the majestic world of whales — their stories, species, and the deep connection we share with them.
      </p>
      <blockquote 
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 1, delay: 0.6 } }"
        class="italic text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto border-l-4 border-white/60 pl-6 py-4"
      >
        "The whale is a creature of myth, of beauty, and of oceanic truth. To hear its song is to touch the soul of the sea."
      </blockquote>
    </div>
  </section>
</template>

<script setup lang="ts">
// Component uses VueUse Motion directives
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
