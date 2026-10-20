<template>
  <component
    :is="interactive ? 'button' : 'div'"
    :type="interactive ? 'button' : undefined"
    :aria-pressed="interactive ? pressed : undefined"
    :aria-controls="interactive ? controls : undefined"
    class="group relative flex h-full w-full flex-col items-start justify-between rounded-2xl border text-left backdrop-blur-sm"
    :class="[
      size === 'sm' ? 'gap-2 px-3.5 py-3.5' : 'gap-3 px-4 py-4',
      !interactive
        ? 'border-white/10 bg-base-200/45'
        : pressed
          ? 'cursor-pointer border-primary/70 bg-primary/[0.13] shadow-[inset_0_0_0_1px_rgba(0,240,255,0.3),0_14px_34px_-16px_rgba(0,240,255,0.7)]'
          : 'cursor-pointer border-white/15 bg-base-200/45 hover:border-primary/50 hover:bg-base-200/70 hover:shadow-[0_14px_30px_-18px_rgba(0,240,255,0.6)] motion-safe:hover:-translate-y-0.5',
      interactive ? 'transition duration-200 ease-out active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary' : '',
    ]"
  >
    <span
      class="block font-whale leading-[1.05] tabular-nums text-primary transition-[text-shadow] duration-200"
      :class="[
        size === 'sm' ? 'text-xl lg:text-2xl' : 'text-[1.375rem] sm:text-2xl lg:text-[1.85rem]',
        pressed ? '[text-shadow:0_0_18px_rgba(0,240,255,0.45)]' : '',
      ]"
    >
      <span aria-hidden="true">{{ value }}</span>
      <span class="sr-only">{{ spokenValue }}</span>
    </span>
    <span class="flex w-full items-end justify-between gap-2">
      <span
        class="text-xs leading-snug transition-colors"
        :class="pressed ? 'text-base-content/90' : 'text-base-content/65'"
      >
        {{ label }}
      </span>
      <ChevronDownIcon
        v-if="interactive"
        class="h-4 w-4 flex-none transition-transform duration-200 motion-reduce:transition-none"
        :class="pressed ? 'rotate-180 text-primary' : 'text-base-content/50 group-hover:text-primary'"
      />
    </span>
  </component>
</template>

<script setup lang="ts">
/**
 * One KPI tile for the whole site: figure on top, caption below. Interactive tiles are
 * toggle buttons (the page owns which one is pressed and shows the story); static tiles
 * are plain blocks with no hover cue, so they never look clickable. Figure sizes keep
 * "~2.9 million" on one line in a quarter-width tile at every breakpoint.
 */
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

const props = withDefaults(defineProps<{
  value: string
  label: string
  /** Renders a toggle button with `aria-pressed`; the parent handles the click. */
  interactive?: boolean
  pressed?: boolean
  /** Id of the region the tile reveals, for `aria-controls`. */
  controls?: string
  /** `sm` for compact strips; `md` for hero rows. */
  size?: 'sm' | 'md'
}>(), {
  interactive: false,
  pressed: false,
  controls: undefined,
  size: 'md',
})

// "~384" reads as "tilde 384" in some screen readers; say what the symbol means.
const spokenValue = computed(() => props.value
  .replace(/^~\s*/, 'about ')
  .replace(/^>\s*/, 'more than ')
  .replace(/^<\s*/, 'less than '))
</script>
