<template>
  <div class="min-h-screen bg-base-100 py-20 px-6">
    <div class="max-w-7xl mx-auto">
      <h1 
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.8 } }"
        class="text-5xl md:text-6xl font-whale text-center mb-4"
      >
        About Whalesome
      </h1>
      <p 
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1 } }"
        class="text-xl text-center text-base-content/70 mb-16 max-w-3xl mx-auto"
      >
        A project born from passion, curiosity, and the desire to create something meaningful
      </p>

      <!-- Three Pillars -->
      <div class="grid md:grid-cols-3 gap-8 mb-16">
        <!-- My Love for Whales -->
        <div 
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } }"
          class="card bg-base-200 shadow-xl"
        >
          <div class="card-body">
            <div class="text-6xl mb-4 text-center">🐋</div>
            <h2 class="card-title text-2xl justify-center mb-4">My Love for Whales</h2>
            <p class="text-base-content/80">
              Whales have always captivated me with their majestic presence, intelligence, and the mysterious depths they call home. This project is a tribute to these magnificent creatures and an expression of my deep appreciation for marine life.
            </p>
            <p class="text-base-content/70 text-sm mt-4 italic">
              "The ocean's gentle giants remind us of the beauty and wonder that exists in our natural world."
            </p>
          </div>
        </div>

        <!-- My Sandbox for Learning -->
        <div 
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.3 } }"
          class="card bg-base-200 shadow-xl"
        >
          <div class="card-body">
            <div class="text-6xl mb-4 text-center">🧪</div>
            <h2 class="card-title text-2xl justify-center mb-4">My Sandbox for Learning</h2>
            <p class="text-base-content/80">
              Whalesome serves as my experimental playground for exploring new web technologies, design patterns, and creative implementations. It's a space where I can try new ideas, learn from mistakes, and push the boundaries of what's possible.
            </p>
            <p class="text-base-content/70 text-sm mt-4 italic">
              "Every feature is an opportunity to learn something new and grow as a developer."
            </p>
          </div>
        </div>

        <!-- My Passion for Web Development -->
        <div 
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.4 } }"
          class="card bg-base-200 shadow-xl"
        >
          <div class="card-body">
            <div class="text-6xl mb-4 text-center">💻</div>
            <h2 class="card-title text-2xl justify-center mb-4">My Passion for Web Development</h2>
            <p class="text-base-content/80">
              Building beautiful, functional, and accessible web experiences is what drives me. This project showcases modern web development practices, from responsive design to smooth animations, all while telling a meaningful story.
            </p>
            <p class="text-base-content/70 text-sm mt-4 italic">
              "Code is poetry, and the web is my canvas for creating digital experiences."
            </p>
          </div>
        </div>
      </div>

      <!-- Tech Stack -->
      <div 
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.5 } }"
        class="card bg-base-200 shadow-xl"
      >
        <div class="card-body">
          <h2 class="card-title text-2xl mb-4">Built With</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-base-100 rounded-lg">
              <div class="text-3xl mb-2">⚡</div>
              <p class="font-semibold">Nuxt 3</p>
              <p class="text-sm text-base-content/70">Vue.js Framework</p>
            </div>
            <div class="text-center p-4 bg-base-100 rounded-lg">
              <div class="text-3xl mb-2">🎨</div>
              <p class="font-semibold">DaisyUI</p>
              <p class="text-sm text-base-content/70">Component Library</p>
            </div>
            <div class="text-center p-4 bg-base-100 rounded-lg">
              <div class="text-3xl mb-2">🌈</div>
              <p class="font-semibold">Tailwind CSS</p>
              <p class="text-sm text-base-content/70">Utility-First CSS</p>
            </div>
            <div class="text-center p-4 bg-base-100 rounded-lg">
              <div class="text-3xl mb-2">✨</div>
              <p class="font-semibold">VueUse Motion</p>
              <p class="text-sm text-base-content/70">Animations</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="text-center mt-12">
        <NuxtLink
          to="/"
          class="btn btn-primary btn-lg"
        >
          ← Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// About page with three pillars of motivation
</script>
