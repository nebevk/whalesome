<template>
  <div class="min-h-screen bg-ocean-light text-whale-blue p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-5xl font-whale mb-8 text-center">🐋 Whale Species</h1>

      <div class="grid gap-6 md:grid-cols-2">
        <div
          v-for="(whale, index) in whales"
          :key="index"
          class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <h2 class="text-2xl font-whale mb-2">{{ whale.name }}</h2>
          <p class="text-whale-gray mb-4">{{ whale.description }}</p>
          <div class="text-sm text-whale-gray">
            <p><span class="font-semibold">Size:</span> {{ whale.size }}</p>
            <p>
              <span class="font-semibold">Habitat:</span> {{ whale.habitat }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-8 text-center">
        <NuxtLink
          to="/"
          class="inline-block px-4 py-2 bg-ocean-dark text-white rounded-lg hover:bg-ocean"
        >
          Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const whales = [
  {
    name: "Blue Whale",
    description:
      "The largest animal known to have ever existed, reaching lengths of up to 100 feet.",
    size: "Up to 100 feet (30 meters)",
    habitat: "All oceans except the Arctic",
  },
  {
    name: "Humpback Whale",
    description: "Known for their spectacular breaching and complex songs.",
    size: "40-60 feet (12-18 meters)",
    habitat: "All major oceans",
  },
  {
    name: "Orca (Killer Whale)",
    description:
      "Actually the largest member of the dolphin family, known for their intelligence and social behavior.",
    size: "20-30 feet (6-9 meters)",
    habitat: "All oceans, from Arctic to Antarctic",
  },
  {
    name: "Beluga Whale",
    description:
      'Known as the "canary of the sea" due to their high-pitched vocalizations.',
    size: "13-20 feet (4-6 meters)",
    habitat: "Arctic and sub-Arctic waters",
  },
];
</script>
