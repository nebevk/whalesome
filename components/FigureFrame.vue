<template>
  <div
    class="relative overflow-hidden rounded-box bg-base-100"
    :class="height ? '' : 'aspect-[4/3] sm:aspect-[16/10]'"
    :style="height ? { height: `${height}px` } : undefined"
  >
    <!-- Interactive figures are standalone pages in public/figures/ (built from figures/),
         framed so their global CSS and inlined kit script can't reach the site. Each one
         posts its height, and the frame follows it at every width. -->
    <iframe
      ref="frame"
      :src="src"
      :title="title"
      loading="lazy"
      class="absolute inset-0 h-full w-full border-0"
      @load="ping"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{ src: string, title: string }>()

const frame = ref<HTMLIFrameElement | null>(null)
const height = ref(0)

// The prerendered frame can finish loading before this component hydrates, so its
// first height report goes unheard. Asking again on mount and on load covers both orders.
function ping() {
  frame.value?.contentWindow?.postMessage({ type: 'whalesome:figure-ping' }, '*')
}

useEventListener(import.meta.client ? window : null, 'message', (event: MessageEvent) => {
  if (!frame.value || event.source !== frame.value.contentWindow) return
  const data = event.data as { type?: string, height?: number } | null
  if (data?.type === 'whalesome:figure-height' && typeof data.height === 'number' && data.height > 0) {
    height.value = Math.min(Math.ceil(data.height), 2400)
  }
})

onMounted(ping)
</script>
