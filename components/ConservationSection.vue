<template>
  <section class="py-20 px-6 ocean-depth-deepest">
    <div class="max-w-6xl mx-auto">
      <h2 
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.8 } }"
        class="text-4xl md:text-5xl font-whale text-white mb-4 text-center"
      >
        Conservation & Action
      </h2>
      <p 
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1 } }"
        class="text-lg text-white/80 mb-12 text-center max-w-3xl mx-auto"
      >
        Join the movement to protect whales and their ocean home. Every action counts.
      </p>

      <div class="grid md:grid-cols-2 gap-8 mb-12">
        <!-- Get Involved Card -->
        <div 
          v-motion
          :initial="{ opacity: 0, x: -20 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 0.6 } }"
          class="card bg-base-100/10 backdrop-blur-sm border border-white/20 shadow-xl"
        >
          <div class="card-body">
            <h3 class="card-title text-2xl text-white mb-4">Get Involved</h3>
            <p class="text-white/80 mb-4">
              Whales face numerous threats including climate change, ocean pollution, ship strikes, and entanglement in fishing gear. Your support can make a difference.
            </p>
            <ul class="list-disc list-inside space-y-2 text-white/70 mb-6">
              <li>Reduce plastic use and support ocean cleanup efforts</li>
              <li>Choose sustainable seafood options</li>
              <li>Support whale watching tours that follow responsible guidelines</li>
              <li>Advocate for marine protected areas</li>
              <li>Stay informed about whale conservation issues</li>
            </ul>
            <div class="card-actions">
              <button class="btn btn-primary">Learn More</button>
            </div>
          </div>
        </div>

        <!-- Organizations Card -->
        <div 
          v-motion
          :initial="{ opacity: 0, x: 20 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 0.6 } }"
          class="card bg-base-100/10 backdrop-blur-sm border border-white/20 shadow-xl"
        >
          <div class="card-body">
            <h3 class="card-title text-2xl text-white mb-4">Support These Organizations</h3>
            <div class="space-y-4">
              <div v-for="org in organizations" :key="org.name" class="border-b border-white/10 pb-3 last:border-0">
                <h4 class="text-white font-semibold mb-1">{{ org.name }}</h4>
                <p class="text-white/70 text-sm mb-2">{{ org.description }}</p>
                <a :href="org.url" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline text-sm">
                  Visit Website →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Social Media Section -->
      <div 
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.3 } }"
        class="card bg-base-100/10 backdrop-blur-sm border border-white/20 shadow-xl"
      >
        <div class="card-body">
          <h3 class="card-title text-2xl text-white mb-4">Follow & Learn</h3>
          <p class="text-white/80 mb-6">
            Connect with amazing accounts sharing whale conservation work, research, and beautiful ocean photography.
          </p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="account in socialAccounts" :key="account.name" class="text-center">
              <div class="text-3xl mb-2">{{ account.icon }}</div>
              <h4 class="text-white font-semibold text-sm mb-1">{{ account.name }}</h4>
              <a 
                :href="account.url" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="text-primary hover:underline text-xs"
              >
                @{{ account.handle }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const organizations = [
  {
    name: 'Whale and Dolphin Conservation',
    description: 'Dedicated to the protection of whales and dolphins worldwide.',
    url: 'https://uk.whales.org/'
  },
  {
    name: 'Ocean Conservancy',
    description: 'Working to protect the ocean from today\'s greatest global challenges.',
    url: 'https://oceanconservancy.org/'
  },
  {
    name: 'Sea Shepherd Conservation Society',
    description: 'Direct action campaigns to defend, conserve and protect the world\'s oceans.',
    url: 'https://www.seashepherd.org/'
  },
  {
    name: 'International Whaling Commission',
    description: 'The global body charged with the conservation of whales and the management of whaling.',
    url: 'https://iwc.int/'
  }
]

const socialAccounts = [
  {
    name: 'Whale Research',
    handle: 'whaleresearch',
    icon: '🔬',
    url: 'https://instagram.com/whaleresearch'
  },
  {
    name: 'Ocean Life',
    handle: 'oceanlife',
    icon: '🌊',
    url: 'https://instagram.com/oceanlife'
  },
  {
    name: 'Whale Watch',
    handle: 'whalewatch',
    icon: '🐋',
    url: 'https://instagram.com/whalewatch'
  },
  {
    name: 'Marine Conservation',
    handle: 'marineconservation',
    icon: '🌍',
    url: 'https://instagram.com/marineconservation'
  }
]
</script>

<style scoped>
.ocean-depth-deepest {
  background: linear-gradient(to bottom, 
    rgba(0, 0, 139, 0.6) 0%,
    rgba(0, 0, 50, 0.7) 50%,
    rgba(0, 0, 20, 0.8) 100%
  );
}
</style>
