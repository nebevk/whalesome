<template>
  <div class="lg:hidden sticky top-20 md:top-22 z-40 -mx-3 md:mx-0">
    <!-- Phones and tablets (below lg): a compact bar that sticks just under the floating site
         nav, in the same glass style. Desktop gets the SpeciesNav sidebar instead. The nav is
         about 70px tall on phones and 78px from md up, so the bar sits roughly 10px below it,
         and its side insets match the nav's (12px on phones). -->
    <nav
      aria-label="Species"
      class="flex items-center gap-1 rounded-2xl border border-white/10 bg-base-200/75 p-1.5 shadow-[0_10px_40px_-10px_rgba(2,8,20,0.7)] backdrop-blur-xl"
    >
      <NuxtLink
        v-if="prev"
        :to="`/species/${prev.id}`"
        class="btn btn-ghost btn-square rounded-xl"
        :aria-label="`Previous species: ${prev.name}`"
        :title="`Previous: ${prev.name}`"
        aria-keyshortcuts="ArrowLeft"
      >
        <ChevronLeftIcon class="h-5 w-5" />
      </NuxtLink>
      <button v-else type="button" class="btn btn-ghost btn-square rounded-xl" disabled aria-label="No previous species">
        <ChevronLeftIcon class="h-5 w-5" />
      </button>

      <button
        type="button"
        class="flex min-w-0 flex-1 items-center justify-center gap-2 self-stretch rounded-xl px-2 transition-colors hover:bg-base-content/5 focus-visible:outline-2 focus-visible:outline-primary"
        aria-haspopup="dialog"
        aria-controls="species-picker"
        :aria-expanded="open"
        :aria-label="`Choose a species. Now showing ${current.name}, ${position} of ${speciesList.length}.`"
        @click="openPicker"
      >
        <span class="min-w-0 text-center">
          <span class="block truncate text-sm font-semibold leading-tight">{{ current.name }}</span>
          <span class="block text-[0.7rem] leading-tight text-base-content/60 tabular-nums">
            {{ position }} of {{ speciesList.length }} · {{ groupLabel(current.group) }}
          </span>
        </span>
        <ChevronUpDownIcon class="h-4 w-4 flex-none text-base-content/50" aria-hidden="true" />
      </button>

      <NuxtLink
        v-if="next"
        :to="`/species/${next.id}`"
        class="btn btn-ghost btn-square rounded-xl"
        :aria-label="`Next species: ${next.name}`"
        :title="`Next: ${next.name}`"
        aria-keyshortcuts="ArrowRight"
      >
        <ChevronRightIcon class="h-5 w-5" />
      </NuxtLink>
      <button v-else type="button" class="btn btn-ghost btn-square rounded-xl" disabled aria-label="No next species">
        <ChevronRightIcon class="h-5 w-5" />
      </button>
    </nav>

    <!-- Native modal dialog: focus is trapped, Escape closes it, and focus returns to the
         trigger afterwards. A bottom sheet on phones, a centred panel from sm up. -->
    <!-- aria-modal only while open: the closed dialog stays in the DOM, and other keyboard
         shortcuts (quick find, arrow paging) look for [aria-modal="true"] to stand aside. -->
    <dialog
      id="species-picker"
      ref="dialogEl"
      class="modal modal-bottom sm:modal-middle"
      aria-labelledby="species-picker-title"
      :aria-modal="open ? 'true' : undefined"
      @close="open = false"
    >
      <div
        class="modal-box flex max-h-[85dvh] flex-col overflow-hidden p-0 sm:max-h-[min(36rem,85dvh)]"
        @keydown="onArrowKeys"
      >
        <div class="border-b border-base-content/10 p-4 pb-3">
          <div class="mb-3 flex items-center justify-between gap-3">
            <h2 id="species-picker-title" class="font-whale text-xl">Choose a species</h2>
            <form method="dialog">
              <button class="btn btn-ghost btn-sm btn-circle" aria-label="Close">
                <XMarkIcon class="h-5 w-5" />
              </button>
            </form>
          </div>
          <label class="input w-full flex items-center gap-2">
            <MagnifyingGlassIcon class="h-4 w-4 opacity-60" aria-hidden="true" />
            <input
              ref="searchEl"
              v-model="q"
              type="search"
              class="grow"
              placeholder="Search name or family"
              aria-label="Search species"
              autocomplete="off"
              enterkeyhint="go"
              @keydown.enter="goToFirst"
            >
          </label>
        </div>

        <div ref="listEl" class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 pb-3">
          <div v-for="group in groups" :key="group.key">
            <h3
              :id="`species-picker-${group.key}`"
              class="sticky top-0 z-10 bg-base-100 px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-base-content/60"
            >
              {{ group.label }}
            </h3>
            <ul :aria-labelledby="`species-picker-${group.key}`">
              <li v-for="entry in group.items" :key="entry.id">
                <NuxtLink
                  :to="`/species/${entry.id}`"
                  :aria-current="entry.id === current.id ? 'page' : undefined"
                  class="relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                  :class="entry.id === current.id
                    ? 'bg-primary/10 text-primary before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-full before:bg-primary'
                    : 'hover:bg-base-content/5'"
                  @click="close"
                >
                  <span class="min-w-0 flex-1">
                    <span class="block truncate font-medium">{{ entry.name }}</span>
                    <span class="block truncate text-xs italic text-base-content/50">{{ entry.scientificName }}</span>
                  </span>
                  <!-- First on screen, but read after the name. -->
                  <StatusBadge :status="entry.conservationStatus" dot class="order-first" />
                  <CheckIcon v-if="entry.id === current.id" class="h-4 w-4 flex-none" aria-hidden="true" />
                </NuxtLink>
              </li>
            </ul>
          </div>

          <p v-if="!groups.length" class="px-3 py-10 text-center text-sm text-base-content/60">
            No whales match “{{ q.trim() }}”.
          </p>
        </div>
      </div>

      <!-- Click outside to close (DaisyUI's backdrop pattern). -->
      <form method="dialog" class="modal-backdrop">
        <button tabindex="-1">Close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import type { WhaleSpecies } from '~/types/species'

const props = defineProps<{
  /** Every species, in browse order. */
  speciesList: WhaleSpecies[]
  current: WhaleSpecies
  prev: WhaleSpecies | null
  next: WhaleSpecies | null
}>()

const groupLabel = (group: WhaleSpecies['group']) => (group === 'baleen' ? 'Baleen whales' : 'Toothed whales')

const position = computed(() => props.speciesList.findIndex(s => s.id === props.current.id) + 1)

const q = ref('')
const groups = computed(() => {
  const term = q.value.trim().toLowerCase()
  const matches = term
    ? props.speciesList.filter(s => `${s.name} ${s.scientificName} ${s.family}`.toLowerCase().includes(term))
    : props.speciesList
  return (['baleen', 'toothed'] as const)
    .map(key => ({ key, label: groupLabel(key), items: matches.filter(s => s.group === key) }))
    .filter(g => g.items.length)
})

const dialogEl = ref<HTMLDialogElement | null>(null)
const searchEl = ref<HTMLInputElement | null>(null)
const listEl = ref<HTMLElement | null>(null)
const open = ref(false)

async function openPicker() {
  const dialog = dialogEl.value
  if (!dialog || dialog.open) return
  q.value = ''
  dialog.showModal()
  open.value = true
  await nextTick()

  // Start with the current species in view. Only the list scrolls, never the page.
  const list = listEl.value
  const active = list?.querySelector<HTMLElement>('[aria-current="page"]')
  if (list && active) {
    const offset = active.getBoundingClientRect().top - list.getBoundingClientRect().top
    list.scrollTop += offset - list.clientHeight / 2 + active.offsetHeight / 2
  }

  // A fine pointer usually means a keyboard is at hand, so start in the search box. On touch
  // screens that would throw the on-screen keyboard over the list, so the browser's default
  // dialog focus is left as it is.
  if (window.matchMedia('(pointer: fine)').matches) searchEl.value?.focus()
}

// The dialog's own close event (Escape, backdrop) arrives a task later, so programmatic closes
// also drop the open state straight away; aria-modal must not linger for other shortcuts.
function close() {
  dialogEl.value?.close()
  open.value = false
}

/** Enter in the search box opens the first match. */
function goToFirst(e: KeyboardEvent) {
  if (e.isComposing) return
  e.preventDefault()
  const first = groups.value[0]?.items[0]
  if (!first) return
  close()
  if (first.id !== props.current.id) navigateTo(`/species/${first.id}`)
}

/** Up and down step through the results, and back up into the search box. */
function onArrowKeys(e: KeyboardEvent) {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
  const links = Array.from(listEl.value?.querySelectorAll<HTMLElement>('a[href]') ?? [])
  if (!links.length) return
  e.preventDefault()
  const at = links.indexOf(document.activeElement as HTMLElement)
  const to = e.key === 'ArrowDown' ? Math.min(at + 1, links.length - 1) : at - 1
  if (to < 0) searchEl.value?.focus()
  else links[to].focus()
}

// Close on any navigation, the browser's back button included, so the picker never lingers
// over the page transition.
const router = useRouter()
watch(() => router.currentRoute.value.fullPath, close)

// The bar is hidden from lg up. If the window widens past that with the picker open, the
// dialog would vanish while still holding the rest of the page inert, so close it.
const wide = useMediaQuery('(min-width: 1024px)')
watch(wide, (isWide) => {
  if (isWide) close()
})
</script>
