<template>
  <!-- On phones the whole tree sits in a dark glass panel: it falls on the lightest part of
       the page gradient there, and the panel keeps every label above 4.5:1. -->
  <div
    class="relative rounded-2xl border border-white/10 bg-base-300/35 p-2 md:rounded-none md:border-0 md:bg-transparent md:p-0"
  >
    <!-- Controls: a toolbar above the tree on phones, floating over its corner from md up -->
    <div class="mb-2 flex flex-wrap items-center justify-end gap-1 md:absolute md:right-3 md:top-3 md:z-10 md:mb-0">
      <button
        type="button"
        class="btn btn-xs btn-ghost gap-1 bg-base-300/40 backdrop-blur border border-white/10"
        :aria-label="`Switch to ${mode === 'radial' ? 'linear' : 'radial'} layout`"
        @click="toggleMode"
      >
        <ArrowPathIcon class="h-3.5 w-3.5" />
        {{ mode === 'radial' ? 'Linear' : 'Radial' }}
      </button>
      <button
        type="button"
        class="btn btn-xs btn-ghost gap-1 bg-base-300/40 backdrop-blur border border-white/10"
        @click="toggleAll"
      >
        {{ allCollapsed ? 'Expand all' : 'Collapse all' }}
      </button>
      <div
        v-if="!compact"
        class="flex items-center gap-0.5 rounded-full bg-base-300/40 backdrop-blur px-1 py-0.5 border border-white/10"
      >
        <button type="button" class="btn btn-xs btn-ghost btn-square" aria-label="Zoom out" @click="zoomBy(-1)"><MinusIcon class="h-4 w-4" /></button>
        <button type="button" class="btn btn-xs btn-ghost btn-square" aria-label="Zoom in" @click="zoomBy(1)"><PlusIcon class="h-4 w-4" /></button>
        <button type="button" class="btn btn-xs btn-ghost btn-square" aria-label="Reset view" @click="fitView"><ArrowsPointingOutIcon class="h-4 w-4" /></button>
      </div>
    </div>

    <div
      ref="viewport"
      class="clado-viewport relative h-[60vh] min-h-[360px] select-none md:h-[88vh] md:min-h-[540px]"
      :class="{ 'is-narrow': narrow, 'cursor-grab': !compact, 'cursor-grabbing': dragging && !compact }"
      :style="viewportStyle"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="onUp"
      @pointerleave="onUp"
      @wheel="onWheel"
    >
      <svg
        class="w-full block"
        :class="{ 'h-full': !narrow }"
        :style="narrow ? { height: `${vh}px` } : undefined"
        :viewBox="`0 0 ${vw} ${vh}`"
        preserveAspectRatio="xMidYMid meet"
        role="group"
        aria-label="Cetacean family tree"
      >
        <g :transform="`translate(${tx} ${ty}) scale(${scale})`">
          <g :class="{ 'branches-flat': compact }">
            <path
              v-for="l in layout.links"
              :key="l.key"
              :d="l.d"
              class="branch"
              :class="{ dim: dimmed(l.childKey) }"
              fill="none"
            />
          </g>
          <a
            v-for="n in layout.nodes"
            :key="n.key"
            :href="n.speciesId ? `/species/${n.speciesId}` : undefined"
            :transform="`translate(${n.x} ${n.y})`"
            :class="[nodeClass(n), { dim: dimmed(n.key) }]"
            :tabindex="n.rank === 'family' ? 0 : undefined"
            :role="n.rank === 'family' ? 'button' : undefined"
            :aria-expanded="n.rank === 'family' ? String(!n.collapsedFamily) : undefined"
            @click="onNodeClick(n, $event)"
            @keydown="onNodeKey(n, $event)"
            @pointerenter="onNodeEnter(n, $event)"
            @pointerleave="hoverKey = null"
            @focus="hoverKey = n.key"
            @blur="hoverKey = null"
          >
            <title>{{ nodeTitle(n) }}</title>
            <rect
              v-if="n.hitW"
              class="hit"
              x="-12"
              :y="-C_ROW / 2"
              :width="n.hitW"
              :height="C_ROW"
              rx="6"
            />
            <circle :r="n.dotR" :fill="n.dotColor" :class="{ ring: n.collapsedFamily }" />
            <text
              :transform="labelTransform(n)"
              :x="labelX(n)"
              :text-anchor="labelAnchor(n)"
              dy="0.32em"
              :font-size="n.fontSize"
              :font-weight="n.rank === 'species' ? 400 : 600"
            >
              {{ n.label }}
            </text>
          </a>
        </g>
      </svg>
    </div>

    <!-- Status legend + hint: under the tree on phones, floating in its corner from md up -->
    <div class="mt-3 px-1 pb-1 md:pointer-events-none md:absolute md:bottom-3 md:left-3 md:mt-0 md:p-0">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1.5">
        <span v-for="c in legend" :key="c.code" class="flex items-center gap-1 text-[0.7rem] text-white/80">
          <span class="h-2 w-2 rounded-full" :style="{ background: c.color }" aria-hidden="true" />
          <span class="md:hidden">{{ c.full }}</span>
          <abbr :title="c.full" class="hidden md:inline pointer-events-auto cursor-help no-underline">{{ c.label }}</abbr>
        </span>
      </div>
      <p class="text-[0.7rem] text-white/75">
        <template v-if="compact">
          Tap a family to open it. {{ cladogramSpeciesCount }} species in all.
        </template>
        <template v-else>
          Drag to pan, Ctrl + scroll to zoom. Click a family to fold it. {{ cladogramSpeciesCount }} species.
        </template>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon, MinusIcon, ArrowsPointingOutIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import type { IucnCode } from '~/types/species'
import type { CladeNode } from '~/data/cladogram'
import { cladogram, cladogramSpeciesCount } from '~/data/cladogram'
import { iucnMeta } from '~/data/iucn'

interface TNode {
  key: string
  name: string
  sci?: string
  speciesId?: string
  status?: IucnCode
  rank: string
  depth: number
  parent: TNode | null
  children: TNode[]
}

// Build a tree with stable keys + parent refs.
let counter = 0
const byKey = new Map<string, TNode>()
function build(node: CladeNode, depth: number, parent: TNode | null): TNode {
  const t: TNode = {
    key: `k${counter++}`,
    name: node.name,
    sci: node.scientificName,
    speciesId: node.id,
    status: node.status,
    rank: node.rank ?? 'species',
    depth,
    parent,
    children: [],
  }
  byKey.set(t.key, t)
  t.children = (node.children ?? []).map(c => build(c, depth + 1, t))
  return t
}
const root = build(cladogram, 0, null)

type Mode = 'radial' | 'linear'
const mode = ref<Mode>('radial')
// A choice made with the toggle. Shared state, so it survives a trip to a species page
// and back; until someone chooses, the layout follows the screen size.
const userMode = useState<Mode | null>('clado:mode', () => null)
const collapsed = ref(new Set<string>())
const hoverKey = ref<string | null>(null)

// Below md, linear mode is drawn as an indented outline (see layout), which keeps names
// readable on a phone. Set on mount, so the prerendered markup never depends on it.
const NARROW_BP = 768
const narrow = ref(false)
const compact = computed(() => narrow.value && mode.value === 'linear')

const isCollapsed = (n: TNode) => collapsed.value.has(n.key)
const isRenderLeaf = (n: TNode) => n.children.length === 0 || isCollapsed(n)

function countSpecies(n: TNode): number {
  if (n.rank === 'species') return 1
  return n.children.reduce((s, c) => s + countSpecies(c), 0)
}

const ROW = 22
const COL = 460
const RAD_STEP = 145
const LABEL_W = 250
// Phone outline: one row per node, indented by depth, rows tall enough to tap.
const C_ROW = 30
const C_INDENT = 20
const outlineFont = (rank: string) => (rank === 'species' || rank === 'family' ? 14 : 15)

// Rough advance width for Merriweather Sans, a wide face. About 10% generous: it only
// sizes the phone outline, where clipping a name would be worse than a little spare room.
const textW = (s: string, size: number, bold: boolean) => s.length * size * (bold ? 0.57 : 0.54)

// Widest row of the fully expanded outline. Fitting to this rather than to whatever is
// open keeps the scale steady while families open and close.
const COMPACT_W = (() => {
  let w = 0
  for (const n of byKey.values()) {
    const label = n.rank === 'family' ? `${n.name} (${countSpecies(n)})` : n.name
    w = Math.max(w, n.depth * C_INDENT + 9 + textW(label, outlineFont(n.rank), n.rank !== 'species'))
  }
  return Math.ceil(w) + 8
})()

interface PNode {
  key: string; name: string; label: string; sci?: string; speciesId?: string
  rank: string; x: number; y: number; angle: number | null; isLeaf: boolean
  collapsedFamily: boolean; count: number; dotR: number; dotColor: string; fontSize: number
  /** A species the IUCN hasn't assessed yet (e.g. Tamanend's bottlenose dolphin). */
  unassessed: boolean
  /** Width of the invisible tap target behind a row of the phone outline (0 = none). */
  hitW: number
}
interface PLink { key: string; d: string; childKey: string }

const layout = computed(() => {
  const nodes: PNode[] = []
  const links: PLink[] = []
  const outline = compact.value

  function toNode(n: TNode, x: number, y: number, angle: number | null): PNode {
    const leaf = isRenderLeaf(n)
    const collapsedFamily = n.rank === 'family' && isCollapsed(n)
    const count = n.rank === 'family' ? countSpecies(n) : 0
    const isSpecies = n.rank === 'species'
    const label = collapsedFamily ? `${n.name} (${count})` : n.name
    const fontSize = outline ? outlineFont(n.rank) : leaf ? 13 : 15
    const tappable = outline && (!!n.speciesId || n.rank === 'family')
    return {
      key: n.key,
      name: n.name,
      label,
      sci: n.sci,
      speciesId: n.speciesId,
      rank: n.rank,
      x,
      y,
      angle,
      isLeaf: leaf,
      collapsedFamily,
      count,
      dotR: isSpecies ? (n.speciesId ? 4.5 : 3.2) : collapsedFamily ? 5.5 : 5,
      // Clade nodes are cyan; a species without an assessment gets a neutral slate dot
      // rather than borrowing the clade colour.
      dotColor: isSpecies ? (n.status ? iucnMeta[n.status].color : '#94a3b8') : '#00f0ff',
      unassessed: isSpecies && !n.status,
      fontSize,
      hitW: tappable ? Math.ceil(12 + 9 + textW(label, fontSize, !isSpecies) + 10) : 0,
    }
  }

  if (outline) {
    // Rows in reading order. Each child hangs off its parent by an elbow that drops
    // down the parent's column and turns in to the child's dot.
    let row = 0
    const walkOutline = (n: TNode, parent: PNode | null) => {
      const node = toNode(n, n.depth * C_INDENT, row++ * C_ROW, null)
      nodes.push(node)
      if (parent) {
        const r = 8
        links.push({
          key: `${parent.key}>${node.key}`,
          d: `M ${parent.x} ${parent.y} V ${node.y - r} Q ${parent.x} ${node.y} ${parent.x + r} ${node.y} H ${node.x}`,
          childKey: node.key,
        })
      }
      if (!node.isLeaf) n.children.forEach(c => walkOutline(c, node))
    }
    walkOutline(root, null)
    const originX = -14
    const originY = -C_ROW / 2
    return { nodes, links, originX, originY, contentW: COMPACT_W - originX, contentH: row * C_ROW }
  }

  // leaf positions (DFS), parents centred on children
  let idx = 0
  const lp = new Map<string, number>()
  function assign(n: TNode): number {
    let p: number
    if (isRenderLeaf(n)) { p = idx + 0.5; idx++ }
    else { const ps = n.children.map(assign); p = (ps[0] + ps[ps.length - 1]) / 2 }
    lp.set(n.key, p)
    return p
  }
  assign(root)
  const total = Math.max(1, idx)
  const cx = 0
  const cy = 0

  // Node's and the browser's Math.cos/sin can differ in the last bits, which made every
  // radial path a hydration mismatch. Two decimals is far below a pixel and identical on both.
  const r2 = (v: number) => Math.round(v * 100) / 100
  const place = (n: TNode) => {
    const depth = n.depth
    if (mode.value === 'radial') {
      const angle = (lp.get(n.key)! / total) * Math.PI * 2 - Math.PI / 2
      const r = depth * RAD_STEP
      return { x: r2(cx + r * Math.cos(angle)), y: r2(cy + r * Math.sin(angle)), angle }
    }
    return { x: depth * COL, y: lp.get(n.key)! * ROW, angle: null as number | null }
  }
  const polar = (angle: number, r: number) => ({ x: r2(cx + r * Math.cos(angle)), y: r2(cy + r * Math.sin(angle)) })

  function walk(n: TNode) {
    const here = place(n)
    nodes.push(toNode(n, here.x, here.y, here.angle))
    if (!isRenderLeaf(n)) {
      for (const c of n.children) {
        const cp = place(c)
        let d: string
        if (mode.value === 'radial') {
          const rm = ((n.depth + c.depth) / 2) * RAD_STEP
          const c1 = polar(here.angle!, rm)
          const c2 = polar(cp.angle!, rm)
          d = `M ${here.x} ${here.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${cp.x} ${cp.y}`
        }
        else {
          const mx = (here.x + cp.x) / 2
          d = `M ${here.x} ${here.y} C ${mx} ${here.y} ${mx} ${cp.y} ${cp.x} ${cp.y}`
        }
        links.push({ key: `${n.key}>${c.key}`, d, childKey: c.key })
        walk(c)
      }
    }
  }
  walk(root)

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  for (const n of nodes) { minX = Math.min(minX, n.x); maxX = Math.max(maxX, n.x); minY = Math.min(minY, n.y); maxY = Math.max(maxY, n.y) }
  const padR = mode.value === 'radial' ? 165 : LABEL_W
  const padO = mode.value === 'radial' ? 165 : 20
  const originX = minX - padO
  const originY = minY - padO
  const contentW = (maxX + padR) - originX
  const contentH = (maxY + padO) - originY
  return { nodes, links, originX, originY, contentW, contentH }
})

const legend = (['CR', 'EN', 'VU', 'NT', 'LC', 'DD'] as IucnCode[]).map(code => ({
  code,
  label: iucnMeta[code].short,
  full: iucnMeta[code].label,
  color: iucnMeta[code].color,
}))

// hover lineage (ancestors + visible descendants)
const hoverSet = computed(() => {
  if (!hoverKey.value) return null
  const tn = byKey.get(hoverKey.value)
  if (!tn) return null
  const set = new Set<string>()
  let a: TNode | null = tn
  while (a) { set.add(a.key); a = a.parent }
  const desc = (n: TNode) => { set.add(n.key); if (!isCollapsed(n)) n.children.forEach(desc) }
  desc(tn)
  return set
})
const dimmed = (key: string) => hoverSet.value != null && !hoverSet.value.has(key)

function nodeClass(n: PNode) {
  if (n.rank === 'family') return 'node node-family'
  if (!n.isLeaf) return 'node node-clade'
  return n.speciesId ? 'node node-profile' : 'node node-tip'
}

// The tooltip doubles as the accessible name, so it starts with the visible label.
function nodeTitle(n: PNode) {
  const base = n.sci && n.sci !== n.name ? `${n.name} (${n.sci})` : n.name
  if (n.unassessed) return `${base}, not yet assessed by the IUCN`
  return n.rank === 'family' ? `${base}, ${n.count} species` : base
}

// labels
function labelTransform(n: PNode) {
  if (n.angle == null) return undefined
  const deg = (n.angle * 180) / Math.PI
  return Math.cos(n.angle) < 0 ? `rotate(${deg}) rotate(180)` : `rotate(${deg})`
}
function labelX(n: PNode) {
  const gap = n.isLeaf ? 9 : 8
  if (n.angle == null) return gap
  return Math.cos(n.angle) < 0 ? -gap : gap
}
function labelAnchor(n: PNode) {
  if (n.angle == null) return 'start'
  return Math.cos(n.angle) < 0 ? 'end' : 'start'
}

// interactions
const router = useRouter()
function toggleCollapse(key: string) {
  const next = new Set(collapsed.value)
  next.has(key) ? next.delete(key) : next.add(key)
  collapsed.value = next
}
function onNodeClick(n: PNode, e: MouseEvent) {
  // A click that ends a drag is not a click. Keyboard activation (detail 0) always is.
  if (moved && e.detail > 0 && !compact.value) { e.preventDefault(); return }
  if (n.speciesId) { e.preventDefault(); router.push(`/species/${n.speciesId}`); return }
  if (n.rank === 'family') { e.preventDefault(); toggleCollapse(n.key) }
}
// Families are buttons for keyboard users too: Enter or Space folds and opens them.
function onNodeKey(n: PNode, e: KeyboardEvent) {
  if (n.rank !== 'family' || (e.key !== 'Enter' && e.key !== ' ')) return
  e.preventDefault()
  toggleCollapse(n.key)
}
// Lineage highlight follows a mouse; on touch it would only flash during a tap.
function onNodeEnter(n: PNode, e: PointerEvent) {
  if (e.pointerType === 'mouse') hoverKey.value = n.key
}

const familyKeys = (() => {
  const keys: string[] = []
  const walk = (n: TNode) => { if (n.rank === 'family') keys.push(n.key); n.children.forEach(walk) }
  walk(root)
  return keys
})()
const allCollapsed = computed(() => familyKeys.every(k => collapsed.value.has(k)))
function toggleAll() {
  collapsed.value = allCollapsed.value ? new Set() : new Set(familyKeys)
  nextTick(fitView)
}
function toggleMode() {
  mode.value = mode.value === 'radial' ? 'linear' : 'radial'
  userMode.value = mode.value
  nextTick(fitView)
}

// ---- pan + zoom ----
const viewport = ref<HTMLElement | null>(null)
const vw = ref(1400)
const vh = ref(700)
const scale = ref(0.5)
const tx = ref(40)
const ty = ref(40)
const fitScale = ref(0.5)
// Explicit box height on phones, where the box is sized to the tree. From md up CSS sizes it.
const boxH = ref<number | null>(null)
const dragging = ref(false)
let lastX = 0, lastY = 0, downX = 0, downY = 0, pid = -1
let moved = false

const zoomedIn = computed(() => scale.value > fitScale.value * 1.02)
const viewportStyle = computed(() => ({
  // The page scrolls past the tree until someone zooms in; from then on a drag pans it.
  // The phone outline never pans, so pinch-zooming the page still works over it.
  touchAction: compact.value ? 'manipulation' : zoomedIn.value ? 'none' : 'pan-y',
  ...(boxH.value ? { height: `${boxH.value}px`, minHeight: '0px' } : {}),
}))

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

function fitView() {
  const el = viewport.value
  if (!el) return
  const w = el.clientWidth
  const { originX, originY, contentW, contentH } = layout.value

  if (narrow.value) {
    let s: number
    let h: number
    let pad: number
    if (compact.value) {
      // Outline: fit the width at a readable size and let the box grow with the tree,
      // so the page itself scrolls through it. No nested scrolling, no panning.
      pad = 8
      s = clamp((w - pad * 2) / contentW, 0.6, 1.1)
      h = Math.ceil(contentH * s + pad * 2)
    }
    else {
      // Radial on a phone: fit the width and size the box to the tree, capped to the screen,
      // instead of a tall box with empty water above and below.
      pad = 12
      const sw = (w - pad * 2) / contentW
      h = Math.min(Math.ceil(contentH * sw + pad * 2), Math.round(window.innerHeight * 0.8))
      s = Math.min(sw, (h - pad * 2) / contentH)
    }
    vw.value = w
    vh.value = h
    boxH.value = h
    scale.value = s
    fitScale.value = s
    tx.value = Math.max(pad, (w - s * contentW) / 2) - s * originX
    ty.value = compact.value ? pad - s * originY : (h - s * contentH) / 2 - s * originY
    return
  }

  // From md up CSS sizes the box. If it was just sized for a phone, let that inline
  // height clear before measuring.
  if (boxH.value !== null) {
    boxH.value = null
    nextTick(fitView)
    return
  }
  vw.value = w
  vh.value = el.clientHeight
  const pad = 16
  if (mode.value === 'linear' && vw.value >= 760) {
    const s = (vw.value - pad * 2) / contentW
    scale.value = s
    tx.value = pad - s * originX
    ty.value = pad - s * originY
  }
  else {
    const s = Math.min((vw.value - pad * 2) / contentW, (vh.value - pad * 2) / contentH)
    scale.value = s
    tx.value = (vw.value - s * contentW) / 2 - s * originX
    ty.value = (vh.value - s * contentH) / 2 - s * originY
  }
  fitScale.value = scale.value
}

// The outline grows and shrinks with what is open, so refit it on every change.
watch(layout, () => {
  if (compact.value) fitView()
})

function zoomAt(cx: number, cy: number, factor: number) {
  const next = clamp(scale.value * factor, 0.08, 4)
  const k = next / scale.value
  tx.value = cx - (cx - tx.value) * k
  ty.value = cy - (cy - ty.value) * k
  scale.value = next
}
function zoomBy(dir: number) {
  zoomAt(vw.value / 2, vh.value / 2, dir > 0 ? 1.3 : 1 / 1.3)
}
function onWheel(e: WheelEvent) {
  if (compact.value || (!e.ctrlKey && !e.metaKey)) return
  e.preventDefault()
  const rect = viewport.value!.getBoundingClientRect()
  zoomAt(e.clientX - rect.left, e.clientY - rect.top, e.deltaY < 0 ? 1.12 : 1 / 1.12)
}

// Active pointers, so two fingers can pinch to zoom on a touch screen.
const pointers = new Map<number, { x: number; y: number }>()
let pinchDist = 0
const spread = () => {
  const [a, b] = [...pointers.values()]
  return Math.hypot(a.x - b.x, a.y - b.y)
}
const midpoint = () => {
  const [a, b] = [...pointers.values()]
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

function onDown(e: PointerEvent) {
  if (compact.value || (e.pointerType === 'mouse' && e.button !== 0)) return
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
  if (pointers.size === 2) {
    pinchDist = spread()
    moved = true // a pinch never ends in a click
    return
  }
  if (pointers.size > 2) return
  pid = e.pointerId
  downX = lastX = e.clientX
  downY = lastY = e.clientY
  moved = false
  dragging.value = true
}
function onMove(e: PointerEvent) {
  const pt = pointers.get(e.pointerId)
  if (!pt) return
  if (pointers.size === 2) {
    const before = midpoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const after = midpoint()
    const dist = spread()
    const rect = viewport.value!.getBoundingClientRect()
    // Pan with the fingers first, then zoom about where they are now, so the point
    // between them stays under them.
    tx.value += after.x - before.x
    ty.value += after.y - before.y
    if (pinchDist > 0 && dist > 0) zoomAt(after.x - rect.left, after.y - rect.top, dist / pinchDist)
    pinchDist = dist
    return
  }
  pt.x = e.clientX
  pt.y = e.clientY
  if (!dragging.value || e.pointerId !== pid) return
  if (!moved && (Math.abs(e.clientX - downX) > 4 || Math.abs(e.clientY - downY) > 4)) {
    moved = true
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(pid)
  }
  if (moved) {
    tx.value += e.clientX - lastX
    ty.value += e.clientY - lastY
  }
  lastX = e.clientX
  lastY = e.clientY
}
function onUp(e: PointerEvent) {
  pointers.delete(e.pointerId)
  pinchDist = 0
  if (pointers.size === 1) {
    // Lifting one finger of a pinch hands the pan to the finger still down.
    const [[id, pt]] = [...pointers.entries()]
    pid = id
    lastX = pt.x
    lastY = pt.y
  }
  if (pointers.size === 0) dragging.value = false
}

let lastW = 0
function onResize() {
  const isNarrow = window.innerWidth < NARROW_BP
  const crossed = isNarrow !== narrow.value
  narrow.value = isNarrow
  if (crossed && !userMode.value) mode.value = isNarrow ? 'linear' : 'radial'
  const w = viewport.value?.clientWidth ?? 0
  // Phone browsers fire resize as the URL bar slides; on a phone only a width change matters.
  if (!crossed && isNarrow && w === lastW) return
  lastW = w
  nextTick(fitView)
}

onMounted(() => {
  narrow.value = window.innerWidth < NARROW_BP
  mode.value = userMode.value ?? (narrow.value ? 'linear' : 'radial')
  // On a phone the outline opens folded to its families: a short overview instead of a
  // hundred-row scroll. Tapping a family opens it.
  if (narrow.value) collapsed.value = new Set(familyKeys)
  lastW = viewport.value?.clientWidth ?? 0
  nextTick(fitView)
  useEventListener(window, 'resize', onResize)
})
</script>

<style scoped>
.clado-viewport {
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 3%, #000 97%, transparent 100%);
  mask-image: linear-gradient(to bottom, transparent 0, #000 3%, #000 97%, transparent 100%);
}
/* On phones the panel frames the tree, so no fade; the box follows the tree's height. */
.clado-viewport.is-narrow {
  -webkit-mask-image: none;
  mask-image: none;
  overflow: hidden;
}
@media (prefers-reduced-motion: no-preference) {
  .clado-viewport.is-narrow {
    transition: height 0.3s ease;
  }
}
.branch {
  stroke: rgba(160, 220, 255, 0.3);
  stroke-width: 1.4;
  transition: opacity 0.2s ease;
}
/* Outline elbows share their parent's column. Fading the group as a whole, rather than
   each stroke, stops the shared runs stacking up brighter where they overlap. */
.branches-flat {
  opacity: 0.35;
}
.branches-flat .branch {
  stroke: rgb(160 220 255);
}
.node {
  transition: opacity 0.2s ease;
  outline: none;
}
.node text {
  font-family: var(--font-sans);
}
.dim {
  opacity: 0.1;
}
.node-clade text,
.node-family text {
  fill: #fff;
}
.node-family {
  cursor: pointer;
}
/* Names without a profile. Raised from 60% so they hold 4.5:1 across the tree. */
.node-tip text {
  fill: rgba(224, 242, 254, 0.86);
}
.node-profile {
  cursor: pointer;
}
.node-profile text {
  fill: #7fe9ff;
}
.node-profile:hover text,
.node-profile:focus-visible text {
  fill: #fff;
  font-weight: 600;
}
.ring {
  stroke: #fff;
  stroke-width: 1.5;
  fill-opacity: 0.25;
}
.hit {
  fill: transparent;
}
.node-family:hover .hit,
.node-profile:hover .hit {
  fill: rgb(255 255 255 / 0.05);
}
.node:focus-visible circle {
  stroke: #fff;
  stroke-width: 2;
}
.node:focus-visible text {
  text-decoration: underline;
}
.node:focus-visible .hit {
  fill: rgb(0 240 255 / 0.12);
}
</style>
