<template>
  <span
    v-if="dot"
    role="img"
    class="inline-block h-2.5 w-2.5 rounded-full flex-shrink-0"
    :style="{ background: meta.color }"
    :aria-label="meta.label"
    :title="tooltip"
  />
  <span
    v-else
    class="inline-flex items-center gap-1.5 text-xs font-medium leading-none whitespace-nowrap"
    :class="{ 'rounded-full border bg-base-300 px-2.5 py-0.5': !plain }"
    :style="{ borderColor: meta.color, color: meta.color }"
    :title="tooltip"
  >
    <!-- The pill has its own opaque base-300 fill, so every status colour reads at 5.3:1 or
         better (CR is the lowest) whatever sits behind it: translucent cards, the sunlit top
         of the homepage. A translucent fill is not enough; CR drops below 4.5:1. -->
    <span class="h-2 w-2 rounded-full flex-shrink-0" :style="{ background: meta.color }" aria-hidden="true" />
    <!-- A bare code (EN, DD) is never left unexplained: assistive tech reads the full name,
         and the tooltip spells it out for everyone else. -->
    <template v-if="short">
      <span aria-hidden="true">{{ meta.short }}</span>
      <span class="sr-only">{{ meta.label }}</span>
    </template>
    <template v-else>{{ label }}</template>
  </span>
</template>

<script setup lang="ts">
import { iucnMeta, iucnFromStatus } from '~/data/iucn'

const props = defineProps<{
  status: string
  /** Show the Red List code (EN) instead of the name. */
  short?: boolean
  /**
   * Dot and text without the pill, for tight rows. It has no fill of its own, so use it only on
   * opaque base-200 or darker surfaces, where every status colour still clears 4.5:1.
   */
  plain?: boolean
  /**
   * Just the coloured dot, for dense lists. It carries meaning, so it renders as an image
   * named by the status. (No template comment above the root: class fallthrough needs a
   * single root node.)
   */
  dot?: boolean
}>()

const code = computed(() => iucnFromStatus(props.status))
const meta = computed(() => iucnMeta[code.value])
const label = computed(() => props.status.split('(')[0].trim())
// The full status string keeps any caveat, e.g. "Least Concern (some populations endangered)".
const tooltip = computed(() => `IUCN Red List: ${props.status}`)
</script>
