<template>
  <!-- The Whalesome mark: a tail slipping under a wave, the same drawing as
       public/favicon.svg but in currentColor. Defaults to 1em; size it with
       h-* / w-* classes like any icon. -->
  <svg
    viewBox="4 10 56 44"
    width="1em"
    height="1em"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M32 21c-8-7-20-8-26-4 8 4 18 8 24 13 1 7 1 14 2 21 1-7 1-14 2-21 6-5 16-9 24-13-6-4-18-3-26 4z" />
    <path
      v-if="wave"
      d="M14 50c4-3 8-3 12 0 4 3 8 3 12 0 4-3 8-3 12 0"
      fill="none"
      stroke="currentColor"
      stroke-width="2.4"
      stroke-linecap="round"
      opacity="0.55"
    />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ wave?: boolean }>(), { wave: true })
</script>
