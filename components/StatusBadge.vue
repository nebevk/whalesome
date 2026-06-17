<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium leading-none whitespace-nowrap"
    :style="{ borderColor: meta.color, color: meta.color }"
    :title="props.status"
  >
    <span class="h-2 w-2 rounded-full flex-shrink-0" :style="{ background: meta.color }" />
    {{ short ? meta.short : label }}
  </span>
</template>

<script setup lang="ts">
import { iucnMeta, iucnFromStatus } from '~/data/iucn'

const props = defineProps<{ status: string; short?: boolean }>()

const code = computed(() => iucnFromStatus(props.status))
const meta = computed(() => iucnMeta[code.value])
const label = computed(() => props.status.split('(')[0].trim())
</script>
