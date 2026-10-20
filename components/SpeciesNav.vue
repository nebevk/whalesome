<template>
  <aside class="hidden lg:block w-64 flex-shrink-0">
    <!-- Desktop only. Below lg the page shows SpeciesSwitcher instead, so phones are not
         made to scroll past every species before reaching the one they picked. -->
    <!-- Sticks below the floating site nav, and scrolls on its own when the window is short. -->
    <nav
      ref="navEl"
      aria-label="All species"
      class="sticky top-24 max-h-[calc(100dvh_-_7.5rem)] overflow-y-auto overscroll-contain rounded-box bg-base-200 p-3 shadow-lg [scrollbar-width:thin]"
    >
      <div v-for="(group, i) in groups" :key="group.label" :class="i ? 'mt-4' : ''">
        <h3 class="text-xs uppercase tracking-wide text-base-content/60 font-semibold px-3 mt-2 mb-1">
          {{ group.label }}
        </h3>
        <ul class="menu w-full p-0 gap-0.5">
          <li v-for="entry in group.items" :key="entry.id">
            <!-- Current species: a quiet tint and accent bar, so it never outshouts the page title. -->
            <NuxtLink
              :to="`/species/${entry.id}`"
              :aria-current="entry.id === selectedSpeciesId ? 'page' : undefined"
              class="relative rounded-lg"
              :class="entry.id === selectedSpeciesId
                ? 'bg-primary/10 text-primary font-semibold before:absolute before:inset-y-1.5 before:left-0 before:w-[3px] before:rounded-full before:bg-primary'
                : 'text-base-content/75 hover:text-base-content'"
            >
              {{ entry.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import type { WhaleSpecies } from '~/types/species'

interface Props {
  speciesList: WhaleSpecies[]
  selectedSpeciesId: string
}

const props = defineProps<Props>()

const groups = computed(() => [
  { label: 'Baleen whales', items: props.speciesList.filter(s => s.group === 'baleen') },
  { label: 'Toothed whales', items: props.speciesList.filter(s => s.group === 'toothed') },
])

const navEl = ref<HTMLElement | null>(null)

// When the list is taller than the window and the current species sits below the fold of its
// own box, bring it to the middle. Only the list's scroll position moves, never the page.
onMounted(() => {
  const nav = navEl.value
  const active = nav?.querySelector<HTMLElement>('[aria-current="page"]')
  if (!nav || !active) return
  const offset = active.getBoundingClientRect().top - nav.getBoundingClientRect().top
  if (offset >= 0 && offset + active.offsetHeight <= nav.clientHeight) return
  nav.scrollTop += offset - nav.clientHeight / 2 + active.offsetHeight / 2
})
</script>
