<template>
  <div class="card bg-base-200 border border-base-300">
    <div class="card-body p-4 flex-row items-center gap-4">
      <button
        type="button"
        class="btn btn-circle btn-primary flex-shrink-0"
        :disabled="failed"
        :aria-label="playing ? 'Pause' : 'Play'"
        @click="toggle"
      >
        <span v-if="buffering" class="loading loading-spinner loading-sm" aria-hidden="true" />
        <PauseIcon v-else-if="playing" class="h-6 w-6" />
        <PlayIcon v-else class="h-6 w-6" />
      </button>

      <div class="flex-1 min-w-0">
        <p class="font-semibold truncate">{{ clip.label }}</p>
        <p class="text-xs text-base-content/60 truncate">
          <template v-if="failed">Audio could not be loaded.</template>
          <template v-else>{{ clip.source }}</template>
        </p>
        <div class="mt-2 flex items-center gap-2 text-xs text-base-content/70">
          <span class="tabular-nums">{{ formatTime(currentTime) }}</span>
          <progress
            class="progress progress-primary flex-1"
            :value="currentTime"
            :max="duration || 1"
            @click="seek"
          />
          <span class="tabular-nums">{{ formatTime(duration) }}</span>
        </div>
      </div>

      <audio
        ref="audioEl"
        preload="metadata"
        @loadedmetadata="onMeta"
        @timeupdate="onTime"
        @waiting="buffering = true"
        @playing="buffering = false; playing = true"
        @pause="playing = false"
        @ended="onEnded"
        @error="onError"
      >
        <source :src="mp3Url" type="audio/mpeg" />
        <source :src="oggUrl" type="audio/ogg" />
      </audio>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlayIcon, PauseIcon } from '@heroicons/vue/24/solid'
import type { AudioClip } from '~/types/species'
import { wmAudio, wmAudioMp3 } from '~/data/wikimedia'

const props = defineProps<{ clip: AudioClip }>()

const audioEl = ref<HTMLAudioElement | null>(null)
const playing = ref(false)
const buffering = ref(false)
const failed = ref(false)
const currentTime = ref(0)
const duration = ref(0)

const oggUrl = computed(() => wmAudio(props.clip.path))
const mp3Url = computed(() => wmAudioMp3(props.clip.path))

onMounted(() => {
  // Force the browser to re-evaluate <source> children. Without this, some browsers
  // mount the <audio> element before children are attached and never pick a source.
  audioEl.value?.load()
})

watch(() => props.clip.path, () => {
  playing.value = false
  buffering.value = false
  failed.value = false
  currentTime.value = 0
  duration.value = 0
  audioEl.value?.pause()
  audioEl.value?.load()
})

async function toggle() {
  const el = audioEl.value
  if (!el) {
    console.warn('[SpeciesAudio] audioEl ref is null')
    return
  }
  if (failed.value) return

  if (!el.paused) {
    el.pause()
    return
  }

  try {
    if (el.readyState < 2) buffering.value = true
    await el.play()
    // `playing` will be set by the @playing event listener; setting it here too
    // makes the icon flip immediately even if the @playing event lags.
    playing.value = true
  }
  catch (err) {
    console.error('[SpeciesAudio] play() rejected:', err)
    failed.value = true
    buffering.value = false
  }
}

function onMeta() {
  if (audioEl.value) duration.value = audioEl.value.duration || 0
}

function onTime() {
  if (audioEl.value) currentTime.value = audioEl.value.currentTime
}

function onEnded() {
  playing.value = false
  buffering.value = false
  currentTime.value = 0
}

function onError(e: Event) {
  const el = e.target as HTMLAudioElement
  console.error('[SpeciesAudio] media error:', el.error, 'src:', el.currentSrc)
  failed.value = true
  buffering.value = false
  playing.value = false
}

function seek(e: MouseEvent) {
  const target = e.currentTarget as HTMLProgressElement
  if (!target || !duration.value || !audioEl.value) return
  const rect = target.getBoundingClientRect()
  const ratio = (e.clientX - rect.left) / rect.width
  audioEl.value.currentTime = ratio * duration.value
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
</script>
