<template>
  <div class="dropdown dropdown-end">
    <div
      tabindex="0"
      role="button"
      class="btn btn-ghost btn-sm btn-circle relative"
      :aria-label="`Ambient settings, currently ${phaseLabel}`"
    >
      <component :is="phaseIcon" class="h-5 w-5" />
      <span
        v-if="soundOn"
        class="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary animate-pulse"
        aria-hidden="true"
      />
    </div>

    <div
      tabindex="0"
      class="dropdown-content z-50 mt-3 w-72 rounded-2xl border border-white/10 bg-base-200/95 backdrop-blur-xl p-4 shadow-2xl"
    >
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-semibold">Ambient</h3>
        <span class="text-xs text-base-content/60 inline-flex items-center gap-1">
          <component :is="phaseIcon" class="h-3.5 w-3.5" />
          {{ phaseLabel }}<template v-if="clock"> · {{ clock }}</template>
        </span>
      </div>

      <label class="flex items-center justify-between gap-3 py-1.5 cursor-pointer">
        <span class="inline-flex items-center gap-2 text-sm">
          <SpeakerWaveIcon class="h-5 w-5 text-primary" />
          Underwater sound
        </span>
        <input
          type="checkbox"
          class="toggle toggle-primary toggle-sm"
          :checked="soundOn"
          @change="toggleSound"
        >
      </label>
      <div v-if="soundOn" class="px-0.5 pt-1 pb-2">
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          :value="volume"
          class="range range-primary range-xs"
          aria-label="Ambient volume"
          @input="onVolume"
        >
      </div>

      <div class="divider my-1.5 text-[0.65rem] text-base-content/40">colour of the hour</div>

      <label class="flex items-center justify-between gap-3 py-1.5 cursor-pointer">
        <span class="inline-flex items-center gap-2 text-sm">
          <ClockIcon class="h-5 w-5 text-primary" />
          Follow time of day
        </span>
        <input
          type="checkbox"
          class="toggle toggle-primary toggle-sm"
          :checked="timeTheme"
          @change="toggleTimeTheme"
        >
      </label>
      <p class="text-xs text-base-content/55 mt-1 leading-relaxed">
        Tints the ocean to match dawn, day, dusk, and night on the homepage.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SunIcon, MoonIcon, SpeakerWaveIcon, ClockIcon } from '@heroicons/vue/24/outline'

const { soundOn, timeTheme, volume, phase, phaseLabel, init, refreshPhase, toggleSound, toggleTimeTheme, setVolume } = useAmbient()

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
