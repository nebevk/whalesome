<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const APP_VERSION = 'v24, re-enable DevTools + page/layout transitions (post og-image fix)'

useHead({
  htmlAttrs: { 'data-theme': 'spirit' },
})

if (import.meta.client) {
  // eslint-disable-next-line no-console
  console.log(`%c[Whalesome] ${APP_VERSION}`, 'color:#00f0ff;font-weight:600')
}
</script>
