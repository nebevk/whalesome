<template>
  <!-- Client-only: the dialog is interactive chrome, so it stays out of the
       prerendered HTML. A native <dialog> opened with showModal() gives us the
       top layer, an inert page behind it, focus return, and Escape to close. -->
  <ClientOnly>
    <dialog
      ref="dialogEl"
      class="modal items-start px-3 pt-3 sm:px-6 sm:pt-[12vh]"
      :aria-labelledby="titleId"
      @close="onDialogClose"
      @pointerdown="onDialogPointerdown"
      @click="onDialogClick"
    >
      <div class="modal-box flex max-h-[calc(100dvh_-_1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-base-200/95 p-0 shadow-2xl motion-reduce:transition-none sm:max-h-[min(36rem,76vh)]">
        <h2 :id="titleId" class="sr-only">Find a whale or a page</h2>

        <div class="flex items-center gap-3 border-b border-white/10 pl-4 pr-2">
          <MagnifyingGlassIcon class="h-5 w-5 flex-shrink-0 text-primary" />
          <input
            ref="inputEl"
            v-model="query"
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded="true"
            :aria-controls="listboxId"
            :aria-activedescendant="activeItem ? optionId(activeItem.index) : undefined"
            :aria-labelledby="titleId"
            placeholder="Find a whale or a page"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
            enterkeyhint="go"
            class="h-14 min-w-0 grow bg-transparent text-base text-white outline-none placeholder:text-base-content/50"
            @keydown="onInputKeydown"
          >
          <button
            type="button"
            class="btn btn-ghost btn-circle size-11 flex-shrink-0 text-base-content/70 sm:size-9"
            aria-label="Close"
            @click="close"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>

        <div ref="scrollEl" class="min-h-0 grow overflow-y-auto overscroll-contain p-2">
          <div :id="listboxId" role="listbox" :aria-labelledby="titleId">
            <div
              v-for="group in view.groups"
              :key="group.key"
              role="group"
              :aria-labelledby="`${listboxId}-${group.key}`"
              class="pb-1"
            >
              <div
                :id="`${listboxId}-${group.key}`"
                role="presentation"
                class="px-3 pb-1.5 pt-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-base-content/60"
              >
                {{ group.label }}
              </div>
              <!-- Each option is a real link: Enter and plain clicks navigate in
                   place, and Ctrl/Cmd/middle-click still opens a new tab. -->
              <NuxtLink
                v-for="item in group.items"
                :id="optionId(item.index)"
                :key="item.key"
                :to="item.to"
                role="option"
                tabindex="-1"
                :aria-selected="item.index === active"
                :aria-label="item.ariaLabel"
                prefetch-on="interaction"
                class="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors"
                :class="item.index === active ? 'bg-white/[0.08] text-white' : 'text-base-content/90'"
                @pointermove="onOptionPointermove($event, item.index)"
                @click="onOptionClick"
              >
                <span
                  class="grid size-9 flex-shrink-0 place-items-center rounded-lg border border-white/10 bg-base-100/60"
                  :class="item.index === active ? 'text-primary' : 'text-base-content/60'"
                >
                  <WhaleLogo v-if="item.kind === 'species'" class="h-5 w-5" />
                  <component :is="item.icon" v-else class="h-5 w-5" />
                </span>
                <span class="min-w-0 grow">
                  <span class="block truncate text-sm font-medium">
                    <template v-for="(part, i) in highlight(item.label)" :key="i">
                      <mark v-if="part.hit" class="bg-transparent text-primary">{{ part.text }}</mark>
                      <template v-else>{{ part.text }}</template>
                    </template>
                  </span>
                  <span class="block truncate text-xs text-base-content/60" :class="{ italic: item.kind === 'species' }">
                    {{ item.sub }}
                  </span>
                </span>
                <span v-if="isCurrent(item.to)" class="flex-shrink-0 text-[0.7rem] text-base-content/60">
                  You are here
                </span>
                <StatusBadge v-if="item.status" :status="item.status" short class="flex-shrink-0" />
                <ArrowTurnDownLeftIcon
                  v-if="item.index === active"
                  class="hidden h-4 w-4 flex-shrink-0 text-primary pointer-fine:block"
                />
              </NuxtLink>
            </div>
          </div>

          <div v-if="!view.flat.length" class="px-6 py-10 text-center">
            <p class="text-base-content/80">Nothing surfaced for “{{ query.trim() }}”.</p>
            <p class="mt-1 text-sm text-base-content/60">
              Try a common name like “humpback”, a family, an ocean, or a scientific name.
            </p>
          </div>
        </div>

        <div class="hidden items-center gap-4 border-t border-white/10 px-4 py-2.5 text-xs text-base-content/60 sm:pointer-fine:flex">
          <span class="inline-flex items-center gap-1"><kbd class="kbd kbd-xs">↑</kbd><kbd class="kbd kbd-xs">↓</kbd> to move</span>
          <span class="inline-flex items-center gap-1"><kbd class="kbd kbd-xs">Enter</kbd> to open</span>
          <span class="inline-flex items-center gap-1"><kbd class="kbd kbd-xs">Esc</kbd> to close</span>
        </div>

        <p class="sr-only" role="status">{{ announcement }}</p>
      </div>
    </dialog>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { MagnifyingGlassIcon, XMarkIcon, ArrowTurnDownLeftIcon, SparklesIcon } from '@heroicons/vue/24/outline'
import { species } from '~/data/species'
import { iucnMeta, iucnFromStatus } from '~/data/iucn'

interface QuickFindPage {
  to: string
  label: string
  blurb: string
  icon: Component
  keywords?: string
}

interface Entry {
  key: string
  kind: 'page' | 'species'
  to: string
  label: string
  sub: string
  icon?: Component
  /** Free-text conservation status, species only. */
  status?: string
  ariaLabel: string
  /** Normalised copies of the text, built once, that the query is matched against. */
  search: { label: string; compact: string; sub: string; rest: string }
}

interface Item extends Entry {
  index: number
}

const props = defineProps<{ pages: QuickFindPage[] }>()

const { isOpen, open, close } = useQuickFind()
const route = useRoute()

const titleId = useId()
const listboxId = useId()
const optionId = (index: number) => `${listboxId}-option-${index}`

const dialogEl = ref<HTMLDialogElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
const scrollEl = ref<HTMLElement | null>(null)
const query = ref('')
const active = ref(0)
const randomId = ref(species[0]?.id ?? '')

// ---- Matching ----

/** Lower-case, strip accents and apostrophes, collapse punctuation to spaces. */
function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function searchFields(label: string, sub: string, rest: string): Entry['search'] {
  const l = normalize(label)
  return { label: l, compact: l.replace(/ /g, ''), sub: normalize(sub), rest: normalize(rest) }
}

const speciesEntries = species.map((s): Entry => {
  const status = iucnMeta[iucnFromStatus(s.conservationStatus)].label
  const group = s.group === 'baleen' ? 'baleen whale' : 'toothed whale'
  return {
    key: `species:${s.id}`,
    kind: 'species',
    to: `/species/${s.id}`,
    label: s.name,
    sub: s.scientificName,
    status: s.conservationStatus,
    ariaLabel: `${s.name}, ${s.scientificName}, ${status}`,
    search: searchFields(s.name, s.scientificName, `${s.family} ${group} ${status} ${s.habitat}`),
  }
})

const pageEntries = computed(() => props.pages.map((p: QuickFindPage): Entry => ({
  key: `page:${p.to}`,
  kind: 'page',
  to: p.to,
  label: p.label,
  sub: p.blurb,
  icon: p.icon,
  ariaLabel: `${p.label}, ${p.blurb}`,
  search: searchFields(p.label, p.blurb, p.keywords ?? ''),
})))

const randomEntry = computed((): Entry => ({
  key: 'random',
  kind: 'page',
  to: `/species/${randomId.value}`,
  label: 'Surprise me',
  sub: 'Swim to a random whale',
  icon: SparklesIcon,
  ariaLabel: 'Surprise me, swim to a random whale',
  search: searchFields('Surprise me', 'Swim to a random whale', 'random lucky any'),
}))

/** Name matches beat scientific-name matches, which beat family, status, or habitat. */
function score(entry: Entry, q: string, compactQ: string, terms: string[]) {
  const { label, compact, sub, rest } = entry.search
  if (label === q) return 100
  if (label.startsWith(q) || compact.startsWith(compactQ)) return 90
  if (label.split(' ').some(word => word.startsWith(q))) return 80
  if (label.includes(q) || compact.includes(compactQ)) return 70
  if (sub.startsWith(q)) return 60
  if (sub.includes(q)) return 50
  const all = `${label} ${sub} ${rest}`
  return terms.every(term => all.includes(term)) ? 30 : 0
}

const groups = computed(() => {
  const pages = [...pageEntries.value, randomEntry.value]
  const q = normalize(query.value)
  if (!q) {
    return [
      { key: 'pages', label: 'Pages', items: pages },
      { key: 'species', label: 'Species', items: speciesEntries },
    ]
  }

  const compactQ = q.replace(/ /g, '')
  const terms = q.split(' ')
  const rank = (list: Entry[]) => list
    .map((entry, order) => ({ entry, order, score: score(entry, q, compactQ, terms) }))
    .filter(hit => hit.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order)

  // Whichever group holds the strongest match comes first.
  return [
    { key: 'pages', label: 'Pages', hits: rank(pages) },
    { key: 'species', label: 'Species', hits: rank(speciesEntries) },
  ]
    .filter(group => group.hits.length)
    .sort((a, b) => b.hits[0].score - a.hits[0].score)
    .map(group => ({ key: group.key, label: group.label, items: group.hits.map(hit => hit.entry) }))
})

/** Groups for rendering, plus one flat list in the same order for arrow keys. */
const view = computed(() => {
  let index = 0
  const indexed = groups.value.map(group => ({
    ...group,
    items: group.items.map((entry): Item => ({ ...entry, index: index++ })),
  }))
  return { groups: indexed, flat: indexed.flatMap(group => group.items) }
})

const activeItem = computed<Item | undefined>(() => view.value.flat[active.value])

/** Split a label around the typed text so the match can be tinted. */
function highlight(text: string) {
  const q = query.value.trim().toLowerCase()
  const at = q ? text.toLowerCase().indexOf(q) : -1
  if (at < 0) return [{ text, hit: false }]
  return [
    { text: text.slice(0, at), hit: false },
    { text: text.slice(at, at + q.length), hit: true },
    { text: text.slice(at + q.length), hit: false },
  ].filter(part => part.text)
}

const currentPath = computed(() => route.path.replace(/\/+$/, '') || '/')
const isCurrent = (to: string) => currentPath.value === to

// A quiet result count for screen readers, debounced so typing is not chatty.
const statusText = computed(() => {
  if (!query.value.trim()) return ''
  const n = view.value.flat.length
  return n ? `${n} ${n === 1 ? 'result' : 'results'}` : 'No matches'
})
const announcement = refDebounced(statusText, 500)

watch(query, () => {
  active.value = 0
})

watch(active, (index) => {
  nextTick(() => {
    if (index === 0) scrollEl.value?.scrollTo({ top: 0 })
    else document.getElementById(optionId(index))?.scrollIntoView({ block: 'nearest' })
  })
})

// ---- Opening and closing ----

function pickRandom() {
  const pool = species.filter(s => `/species/${s.id}` !== currentPath.value)
  return pool[Math.floor(Math.random() * pool.length)]?.id ?? randomId.value
}

function show() {
  const el = dialogEl.value
  if (!el || el.open) return
  query.value = ''
  active.value = 0
  randomId.value = pickRandom()
  el.showModal()
  // Focus synchronously, inside the user's click or key press, so phones raise the keyboard.
  inputEl.value?.focus()
  scrollEl.value?.scrollTo({ top: 0 })
}

function hide() {
  if (dialogEl.value?.open) dialogEl.value.close()
}

// Sync flush keeps showModal() and focus() in the same call stack as the gesture.
watch(isOpen, value => (value ? show() : hide()), { flush: 'sync' })
// The dialog only exists after hydration; honour a request that came in before it did.
watch(dialogEl, (el) => {
  if (el && isOpen.value) show()
})
watch(() => route.fullPath, () => close())

function onDialogClose() {
  // Escape closes the native dialog directly; keep the shared state in step.
  if (!dialogEl.value?.open) close()
}

let pressedOnBackdrop = false
function onDialogPointerdown(e: PointerEvent) {
  pressedOnBackdrop = e.target === dialogEl.value
}
function onDialogClick(e: MouseEvent) {
  // Only a press that starts and ends on the dimmed backdrop closes the dialog,
  // so dragging a text selection out of the input never dismisses it.
  if (pressedOnBackdrop && e.target === dialogEl.value) close()
  pressedOnBackdrop = false
}

function go(item: Item) {
  close()
  navigateTo(item.to)
}

let lastPointer = ''
function onOptionPointermove(e: PointerEvent, index: number) {
  // Browsers send synthetic moves when arrow keys scroll the list under a resting
  // cursor; only follow the pointer when it has really moved.
  const at = `${e.screenX},${e.screenY}`
  if (at === lastPointer) return
  lastPointer = at
  active.value = index
}

function onOptionClick(e: MouseEvent) {
  // Modified clicks open a new tab; keep the dialog open for those.
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  close()
}

function onInputKeydown(e: KeyboardEvent) {
  if (e.isComposing) return
  const count = view.value.flat.length
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    if (!count) return
    const step = e.key === 'ArrowDown' ? 1 : -1
    active.value = (active.value + step + count) % count
  }
  else if (e.key === 'Enter' && activeItem.value) {
    e.preventDefault()
    go(activeItem.value)
  }
}

// ---- Keyboard shortcut: "/" or Ctrl/Cmd+K from anywhere ----

const NON_TEXT_INPUTS = new Set(['checkbox', 'radio', 'range', 'button', 'submit', 'reset', 'color', 'file', 'image'])

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  if (target instanceof HTMLInputElement) return !NON_TEXT_INPUTS.has(target.type)
  return target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement
}

useEventListener(import.meta.client ? window : null, 'keydown', (e: KeyboardEvent) => {
  // Autofill can fire keydown without a key, hence the type check.
  if (e.defaultPrevented || e.isComposing || typeof e.key !== 'string') return
  const slash = e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey
  const commandK = e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey
  if (!slash && !commandK) return

  if (isOpen.value) {
    // Ctrl/Cmd+K toggles; "/" is just a character while the dialog is open.
    if (commandK) {
      e.preventDefault()
      close()
    }
    return
  }
  if (slash && isTypingTarget(e.target)) return
  // Leave other modal layers, like the photo lightbox or the species picker, in charge of the keyboard.
  if (document.querySelector('[aria-modal="true"], dialog[open]')) return

  e.preventDefault()
  open()
})
</script>
