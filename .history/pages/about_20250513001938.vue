<template>
  <div class="min-h-screen bg-ocean-light text-whale-blue p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-5xl font-whale mb-6 text-center">🐳 About Whalesome</h1>
      
      <!-- Introduction -->
      <div class="mb-12 text-center">
        <p class="text-lg text-whale-gray mb-4">
          Whalesome is dedicated to raising awareness about these magnificent
          marine mammals and their conservation.
        </p>
        <p class="text-lg text-whale-gray mb-4">
          Our mission is to educate and inspire people about the importance of
          whale conservation and marine ecosystem protection.
        </p>
        <p class="text-lg text-whale-gray italic">
          This project also serves as a playground for experimenting with modern web technologies and integrations.
        </p>
      </div>

      <!-- Tech Wiki Section -->
      <div class="space-y-6">
        <h2 class="text-3xl font-whale mb-6 text-center">Technology Wiki</h2>
        
        <!-- Core Framework -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-2xl font-whale mb-4">Core Framework</h3>
          <div class="space-y-4">
            <div class="border-b border-gray-200 pb-4">
              <h4 class="text-xl font-semibold mb-2">Nuxt 3</h4>
              <p class="text-whale-gray">
                Using Nuxt 3 for its powerful features like:
              </p>
              <ul class="list-disc list-inside mt-2 text-whale-gray">
                <li>Server-side rendering (SSR)</li>
                <li>Auto-imports for components and composables</li>
                <li>File-based routing</li>
                <li>Built-in TypeScript support</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- UI & Styling -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-2xl font-whale mb-4">UI & Styling</h3>
          <div class="space-y-4">
            <div class="border-b border-gray-200 pb-4">
              <h4 class="text-xl font-semibold mb-2">Tailwind CSS</h4>
              <p class="text-whale-gray">
                Implemented for utility-first styling with custom configuration for:
              </p>
              <ul class="list-disc list-inside mt-2 text-whale-gray">
                <li>Custom color palette (ocean and whale themes)</li>
                <li>Responsive design utilities</li>
                <li>Custom animations and transitions</li>
              </ul>
            </div>
            <div class="border-b border-gray-200 pb-4">
              <h4 class="text-xl font-semibold mb-2">Headless UI</h4>
              <p class="text-whale-gray">
                Used for accessible UI components:
              </p>
              <ul class="list-disc list-inside mt-2 text-whale-gray">
                <li>Modal dialogs</li>
                <li>Navigation menus</li>
                <li>Transition components</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Animations & Interactions -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-2xl font-whale mb-4">Animations & Interactions</h3>
          <div class="space-y-4">
            <div class="border-b border-gray-200 pb-4">
              <h4 class="text-xl font-semibold mb-2">VueUse Motion</h4>
              <p class="text-whale-gray">
                Implemented for smooth animations:
              </p>
              <ul class="list-disc list-inside mt-2 text-whale-gray">
                <li>Scroll-triggered animations</li>
                <li>Page transitions</li>
                <li>Interactive hover effects</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Deployment & Infrastructure -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-2xl font-whale mb-4">Deployment & Infrastructure</h3>
          <div class="space-y-4">
            <div class="border-b border-gray-200 pb-4">
              <h4 class="text-xl font-semibold mb-2">Netlify</h4>
              <p class="text-whale-gray">
                Configured for continuous deployment:
              </p>
              <ul class="list-disc list-inside mt-2 text-whale-gray">
                <li>Automatic deployments from Git</li>
                <li>Preview deployments for pull requests</li>
                <li>Custom domain configuration</li>
                <li>Environment variable management</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Future Integrations -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-2xl font-whale mb-4">Planned Integrations</h3>
          <div class="space-y-4">
            <div class="border-b border-gray-200 pb-4">
              <h4 class="text-xl font-semibold mb-2">Upcoming Features</h4>
              <ul class="list-disc list-inside mt-2 text-whale-gray">
                <li>Content Management System integration</li>
                <li>Analytics and tracking</li>
                <li>Internationalization (i18n)</li>
                <li>Progressive Web App (PWA) features</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="text-center mt-8">
        <NuxtLink
          to="/"
          class="inline-block px-6 py-3 bg-ocean-dark text-white rounded-lg hover:bg-ocean transition-colors"
        >
          Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Add any necessary component logic here
</script>

<style scoped>
.font-whale {
  font-family: 'Whale', sans-serif;
}

.bg-ocean-light {
  background-color: #f0f7ff;
}

.bg-ocean-dark {
  background-color: #1a365d;
}

.bg-ocean {
  background-color: #2c5282;
}

.text-whale-blue {
  color: #1a365d;
}

.text-whale-gray {
  color: #4a5568;
}
</style>
