<template>
  <div class="relative">
    <div
      ref="viewport"
      class="clado-viewport relative h-[88vh] min-h-[540px] cursor-grab select-none [touch-action:pan-y]"
      :class="{ 'cursor-grabbing': dragging }"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="onUp"
      @pointerleave="onUp"
      @wheel="onWheel"
    >
      <svg class="w-full h-full block" :viewBox="`0 0 ${vw} ${vh}`" preserveAspectRatio="xMidYMid meet">
        <g :transform="`translate(${tx} ${ty}) scale(${scale})`">
          <path
            v-for="l in layout.links"
            :key="l.key"
            :d="l.d"
            class="branch"
            :class="{ dim: dimmed(l.childKey) }"
            fill="none"
          />
          <a
            v-for="n in layout.nodes"
            :key="n.key"
            :href="n.speciesId ? `/species/${n.speciesId}` : undefined"
            :transform="`translate(${n.x} ${n.y})`"
            :class="[nodeClass(n), { dim: dimmed(n.key) }]"
            @click="onNodeClick(n, $event)"
            @pointerenter="hoverKey = n.key"
            @pointerleave="hoverKey = null"
          >
            <title>{{ n.sci || n.name }}{{ n.hiddenCount ? ` — ${n.hiddenCount} species` : '' }}</title>
            <circle :r="n.dotR" :fill="n.dotColor" :class="{ ring: n.collapsedFamily }" />
            <text
              :transform="labelTransform(n)"
              :x="labelX(n)"
              :text-anchor="labelAnchor(n)"
              dy="0.32em"
              :font-size="n.fontSize"
              :font-weight="n.isLeaf ? 400 : 600"
            >
              {{ n.label }}
            </text>
          </a>
        </g>
      </svg>
    </div>

    <!-- Floating controls -->
    <div class="absolute right-3 top-3 flex items-center gap-1">
      <button class="btn btn-xs btn-ghost gap-1 bg-base-300/40 backdrop-blur border border-white/10" @click="toggleMode">
        <ArrowPathIcon class="h-3.5 w-3.5" />
        {{ mode === 'radial' ? 'Linear' : 'Radial' }}
      </button>
      <button class="btn btn-xs btn-ghost gap-1 bg-base-300/40 backdrop-blur border border-white/10" @click="toggleAll">
        {{ allCollapsed ? 'Expand all' : 'Collapse all' }}
      </button>
      <div class="flex items-center gap-0.5 rounded-full bg-base-300/40 backdrop-blur px-1 py-0.5 border border-white/10">
        <button class="btn btn-xs btn-ghost btn-square" aria-label="Zoom out" @click="zoomBy(-1)"><MinusIcon class="h-4 w-4" /></button>
        <button class="btn btn-xs btn-ghost btn-square" aria-label="Zoom in" @click="zoomBy(1)"><PlusIcon class="h-4 w-4" /></button>
        <button class="btn btn-xs btn-ghost btn-square" aria-label="Reset view" @click="fitView"><ArrowsPointingOutIcon class="h-4 w-4" /></button>
      </div>
    </div>

    <!-- Floating status legend + hint -->
    <div class="absolute left-3 bottom-3 pointer-events-none">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1.5">
        <span v-for="c in legend" :key="c.code" class="flex items-center gap-1 text-[0.7rem] text-white/55">
          <span class="h-2 w-2 rounded-full" :style="{ background: c.color }" />
          {{ c.label }}
        </span>
      </div>
      <p class="text-[0.7rem] text-white/40">
        Drag to pan. Click a family to collapse it. {{ cladogramSpeciesCount }} species.
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

const mode = ref<'radial' | 'linear'>('radial')
const collapsed = ref(new Set<string>())
const hoverKey = ref<string | null>(null)

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

interface PNode {
  key: string; name: string; label: string; sci?: string; speciesId?: string
  rank: string; x: number; y: number; angle: number | null; isLeaf: boolean
  collapsedFamily: boolean; hiddenCount: number; dotR: number; dotColor: string; fontSize: number
}
interface PLink { key: string; d: string; childKey: string }

const layout = computed(() => {
  const nodes: PNode[] = []
  const links: PLink[] = []

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

  const place = (n: TNode) => {
    const depth = n.depth
    if (mode.value === 'radial') {
      const angle = (lp.get(n.key)! / total) * Math.PI * 2 - Math.PI / 2
      const r = depth * RAD_STEP
      return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), angle }
    }
    return { x: depth * COL, y: lp.get(n.key)! * ROW, angle: null as number | null }
  }
  const polar = (angle: number, r: number) => ({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) })

  function walk(n: TNode) {
    const here = place(n)
    const leaf = isRenderLeaf(n)
    const collapsedFamily = n.rank === 'family' && isCollapsed(n)
    const hiddenCount = collapsedFamily ? countSpecies(n) : 0
    const isSpecies = n.rank === 'species'
    nodes.push({
      key: n.key,
      name: n.name,
      label: collapsedFamily ? `${n.name} (${hiddenCount})` : n.name,
      sci: n.sci,
      speciesId: n.speciesId,
      rank: n.rank,
      x: here.x,
      y: here.y,
      angle: here.angle,
      isLeaf: leaf,
      collapsedFamily,
      hiddenCount,
      dotR: isSpecies ? (n.speciesId ? 4.5 : 3.2) : collapsedFamily ? 5.5 : 5,
      dotColor: isSpecies && n.status ? iucnMeta[n.status].color : '#00f0ff',
      fontSize: leaf ? 13 : 15,
    })
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

const legend = (['CR', 'EN', 'VU', 'NT', 'LC', 'DD'] as IucnCode[]).map(code => ({ code, label: iucnMeta[code].short, color: iucnMeta[code].color }))

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
  if (moved) { e.preventDefault(); return }
  if (n.speciesId) { e.preventDefault(); router.push(`/species/${n.speciesId}`); return }
  if (n.rank === 'family') { e.preventDefault(); toggleCollapse(n.key) }
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
  nextTick(fitView)
}

// ---- pan + zoom ----
const viewport = ref<HTMLElement | null>(null)
const vw = ref(1400)
const vh = ref(700)
const scale = ref(0.5)
const tx = ref(40)
const ty = ref(40)
const dragging = ref(false)
let lastX = 0, lastY = 0, downX = 0, downY = 0, pid = -1
let moved = false

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

function fitView() {
  const el = viewport.value
  if (!el) return
  vw.value = el.clientWidth
  vh.value = el.clientHeight
  const { originX, originY, contentW, contentH } = layout.value
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
}

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
  if (!e.ctrlKey && !e.metaKey) return
  e.preventDefault()
  const rect = viewport.value!.getBoundingClientRect()
  zoomAt(e.clientX - rect.left, e.clientY - rect.top, e.deltaY < 0 ? 1.12 : 1 / 1.12)
}
function onDown(e: PointerEvent) {
  pid = e.pointerId
  downX = lastX = e.clientX
  downY = lastY = e.clientY
  moved = false
  dragging.value = true
}
function onMove(e: PointerEvent) {
  if (!dragging.value) return
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
function onUp() {
  dragging.value = false
}

onMounted(() => {
  fitView()
  useEventListener(window, 'resize', fitView)
})
</script>

<style scoped>
.clado-viewport {
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 3%, #000 97%, transparent 100%);
  mask-image: linear-gradient(to bottom, transparent 0, #000 3%, #000 97%, transparent 100%);
}
.branch {
  stroke: rgba(160, 220, 255, 0.3);
  stroke-width: 1.4;
  transition: opacity 0.2s ease;
}
.node {
  transition: opacity 0.2s ease;
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
.node-tip text {
  fill: rgba(224, 242, 254, 0.6);
}
.node-profile {
  cursor: pointer;
}
.node-profile text {
  fill: #7fe9ff;
}
.node-profile:hover text {
  fill: #fff;
  font-weight: 600;
}
.ring {
  stroke: #fff;
  stroke-width: 1.5;
  fill-opacity: 0.25;
}
</style>
