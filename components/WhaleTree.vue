<template>
  <section id="classification" class="py-20 scroll-mt-20">
    <div class="max-w-6xl mx-auto px-6 text-center">
      <h2 class="text-4xl md:text-5xl font-whale text-white mb-4">
        The Tree of Life
      </h2>
      <p class="text-lg text-white/80 mb-6 max-w-3xl mx-auto">
        Every living cetacean belongs to one of two branches: baleen filter-feeders and toothed
        predators. Explore the whole family tree below. Names in cyan have a full profile, just
        click through.
      </p>
    </div>

    <div class="max-w-[1700px] mx-auto px-2 sm:px-6 mt-4">
      <CladogramTree />
    </div>
  </section>
</template>
