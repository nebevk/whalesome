<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        @click.self="close"
      >
        <button
          type="button"
          class="absolute top-4 right-4 btn btn-ghost btn-circle text-white hover:bg-white/10"
          aria-label="Close"
          @click="close"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>

        <button
          v-if="hasPrev"
          type="button"
          class="absolute left-4 md:left-8 btn btn-ghost btn-circle text-white hover:bg-white/10"
          aria-label="Previous image"
          @click="prev"
        >
          <ChevronLeftIcon class="h-7 w-7" />
        </button>

        <button
          v-if="hasNext"
          type="button"
          class="absolute right-4 md:right-8 btn btn-ghost btn-circle text-white hover:bg-white/10"
          aria-label="Next image"
          @click="next"
        >
          <ChevronRightIcon class="h-7 w-7" />
        </button>

        <figure
          class="max-w-[90vw] max-h-[85vh] flex flex-col items-center"
          @click.stop
        >
          <img
            :src="current?.src"
            :alt="current?.caption"
            class="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          />
          <figcaption v-if="current?.caption" class="mt-4 text-white/80 text-sm text-center max-w-xl">
            {{ current.caption }}
            <span v-if="images.length > 1" class="block text-white/50 text-xs mt-1">
              {{ index + 1 }} / {{ images.length }}
            </span>
          </figcaption>
        </figure>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import type { GalleryImage } from '~/types/species'

const props = defineProps<{
  images: GalleryImage[]
  index: number
  open: boolean
}>()

const emit = defineEmits<{
  'update:index': [n: number]
  'update:open': [v: boolean]
}>()

const current = computed(() => props.images[props.index])
const hasPrev = computed(() => props.index > 0)
const hasNext = computed(() => props.index < props.images.length - 1)

function prev() { if (hasPrev.value) emit('update:index', props.index - 1) }
function next() { if (hasNext.value) emit('update:index', props.index + 1) }
function close() { emit('update:open', false) }

useEventListener(window, 'keydown', (e: KeyboardEvent) => {
  if (!props.open) return
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'ArrowRight') next()
})

watch(() => props.open, (v) => {
  if (import.meta.client) {
    document.body.style.overflow = v ? 'hidden' : ''
  }
})
</script>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
