<template>
  <div>
    <header
      class="bg-ocean-dark text-white p-4 flex justify-between items-center"
    >
      <NuxtLink to="/" class="text-2xl font-whale">Whalesome</NuxtLink>
      <nav class="space-x-4">
        <NuxtLink to="/about">About</NuxtLink>
        <NuxtLink to="/species">Species</NuxtLink>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer class="bg-ocean-dark text-white p-4 text-center mt-10">
      © 2025 Whalesome. Swim with care. 🐳
    </footer>
  </div>
</template>
