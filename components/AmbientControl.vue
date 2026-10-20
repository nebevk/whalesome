<template>
  <div
    ref="root"
    class="dropdown dropdown-end"
    :class="open ? 'dropdown-open' : 'dropdown-close'"
    @keydown="onKeydown"
  >
    <!-- A speaker, not a sun or moon: this sets the ambience, it is not a light/dark switch -->
    <button
      ref="trigger"
      type="button"
      class="btn btn-ghost btn-circle relative size-11 lg:pointer-fine:size-8"
      :class="soundOn ? 'text-primary' : ''"
      :aria-label="triggerLabel"
      :title="triggerLabel"
      :aria-expanded="open"
      :aria-controls="panelId"
      @click="toggle"
    >
      <SpeakerWaveIcon v-if="soundOn" class="h-5 w-5" />
      <SpeakerXMarkIcon v-else class="h-5 w-5" />
      <span
        v-if="soundOn"
        class="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary motion-safe:animate-pulse lg:pointer-fine:right-0.5 lg:pointer-fine:top-0.5"
        aria-hidden="true"
      />
    </button>

    <!-- On small screens the panel is shifted right so it lines up with the nav's
         edge instead of hanging off the left side of a narrow phone. -->
    <div
      :id="panelId"
      role="group"
      :aria-labelledby="headingId"
      class="dropdown-content -right-12 mt-3 w-[min(18rem,calc(100vw_-_2rem))] rounded-2xl border border-white/10 bg-base-200/95 p-4 shadow-2xl backdrop-blur-xl lg:right-0"
    >
      <div class="mb-3 flex items-center justify-between gap-3">
        <p :id="headingId" class="font-semibold">Ambience</p>
        <span class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-base-100/50 px-2.5 py-1 text-xs text-base-content/70">
          <component :is="phaseIcon" class="h-3.5 w-3.5 text-primary" />
          {{ phaseLabel }}<template v-if="clock"> · {{ clock }}</template>
        </span>
      </div>

      <label class="flex cursor-pointer items-center justify-between gap-3 py-1.5">
        <span class="inline-flex items-center gap-2 text-sm">
          <SpeakerWaveIcon class="h-5 w-5 text-primary" />
          Underwater sound
        </span>
        <input
          type="checkbox"
          role="switch"
          class="toggle toggle-primary toggle-sm"
          :checked="soundOn"
          @change="toggleSound"
        >
      </label>
      <p class="text-xs leading-relaxed text-base-content/65">
        A soft ocean wash, synthesized in your browser. It never starts on its own.
      </p>
      <label v-if="soundOn" class="flex items-center gap-3 pb-1 pt-3">
        <span class="w-14 flex-shrink-0 text-xs text-base-content/70">Volume</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          :value="volume"
          :aria-valuetext="`${Math.round(volume * 100)}%`"
          class="range range-primary range-xs"
          @input="onVolume"
        >
      </label>

      <div class="divider my-2 text-[0.65rem] text-base-content/60">colour of the hour</div>

      <label class="flex cursor-pointer items-center justify-between gap-3 py-1.5">
        <span class="inline-flex items-center gap-2 text-sm">
          <ClockIcon class="h-5 w-5 text-primary" />
          Follow time of day
        </span>
        <input
          type="checkbox"
          role="switch"
          class="toggle toggle-primary toggle-sm"
          :checked="timeTheme"
          @change="toggleTimeTheme"
        >
      </label>
      <p class="mt-1 text-xs leading-relaxed text-base-content/65">
        Tints the ocean to match dawn, day, dusk, and night on the homepage.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SunIcon, MoonIcon, SpeakerWaveIcon, SpeakerXMarkIcon, ClockIcon } from '@heroicons/vue/24/outline'

const { soundOn, timeTheme, volume, phase, phaseLabel, init, refreshPhase, toggleSound, toggleTimeTheme, setVolume } = useAmbient()

const root = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)
const { open, toggle, onKeydown } = useDisclosure(root, trigger)
const panelId = useId()
const headingId = useId()

const triggerLabel = computed(() => `Ambience settings, sound ${soundOn.value ? 'on' : 'off'}`)
const phaseIcon = computed(() => (phase.value === 'day' || phase.value === 'dawn' ? SunIcon : MoonIcon))

const clock = ref('')
let timer: ReturnType<typeof setInterval> | null = null
function tick() {
  clock.value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function onVolume(e: Event) {
  setVolume(Number((e.target as HTMLInputElement).value))
}

onMounted(() => {
  init()
  tick()
  refreshPhase()
  // One reliable, component-owned ticker drives both the clock display and the
  // time-of-day phase. Cleaned up on unmount so hot-reloads never leave it running.
  timer = setInterval(() => {
    tick()
    refreshPhase()
  }, 1000)
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>
