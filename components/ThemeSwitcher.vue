<template>
  <div class="flex items-center gap-2">
    <span class="text-sm font-medium opacity-80">
      {{ theme === 'classic' ? 'Classic' : 'Spirit' }}
    </span>
    <input
      type="checkbox"
      :checked="theme === 'spirit'"
      @change="toggleTheme"
      class="toggle"
      :class="theme === 'spirit' ? 'toggle-accent' : 'toggle-primary'"
      aria-label="Toggle theme"
    />
  </div>
</template>

<script setup lang="ts">
const { theme, toggleTheme } = useTheme()
</script>
