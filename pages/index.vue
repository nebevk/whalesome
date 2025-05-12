<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-ocean-light text-whale-blue"
  >
    <h1 class="text-5xl font-whale mb-4">🐋 Welcome to Whalesome!</h1>
    <p class="text-lg text-whale-gray max-w-xl text-center">
      Dive into the world of whales—species, fun facts, and conservation
      efforts.
    </p>
    <NuxtLink
      to="/species"
      class="mt-6 px-4 py-2 bg-ocean-dark text-white rounded-lg hover:bg-ocean"
    >
      Explore Whale Species
    </NuxtLink>
  </div>
</template>
