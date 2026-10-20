<template>
  <section id="classification" class="py-20 scroll-mt-20">
    <div class="max-w-6xl mx-auto px-6 text-center">
      <h2 class="text-4xl md:text-5xl font-whale text-white mb-4">
        The Tree of Life
      </h2>
      <!-- Full white: on phones this sits high on the gradient, where 80% white falls short of 4.5:1. -->
      <p class="text-lg text-white mb-6 max-w-3xl mx-auto">
        Every living cetacean belongs to one of two branches: baleen filter-feeders and toothed
        predators. Explore the whole family tree below. Families open and fold with a click, and
        names in cyan lead to a full profile.
      </p>
    </div>

    <div class="max-w-[1700px] mx-auto px-2 sm:px-6 mt-4">
      <CladogramTree />
    </div>
  </section>
</template>
