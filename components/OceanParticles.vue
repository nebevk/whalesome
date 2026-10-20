<template>
  <canvas
    ref="canvas"
    class="ocean-particles pointer-events-none fixed inset-0 z-0 h-full w-full"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
/**
 * Ambient ocean backdrop. Fixed to the viewport (cheap bitmap) and faded in once you
 * scroll past the sunlit surface, so it only shows behind the darker depth sections.
 * The mix follows the descent: bubbles thin out with depth, marine snow thickens, and
 * from the midnight zone down a few points of bioluminescence pulse slowly in the dark.
 * Honours prefers-reduced-motion with still frames, redrawn only when the depth changes.
 */
interface Particle {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  type: 'bubble' | 'snow' | 'glow'
  alpha: number
  phase: number
  sway: number
  /** Glow only: how fast it brightens and dims, and which colour sprite it uses. */
  pulse: number
  hue: number
}

const canvas = ref<HTMLCanvasElement | null>(null)
const motion = usePreferredReducedMotion()

let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let pending = 0
let running = false
let last = 0
let particles: Particle[] = []
let w = 0
let h = 0
let dpr = 1
let page: HTMLElement | null = null
// Updated on scroll: the fade-in below the surface, and how far down the page we are (0 to 1).
let surfaceFade = 0
let depth = 0

// Blue-green and cyan, the colours of deep-sea bioluminescence.
const GLOW_RGB = ['94, 242, 214', '79, 209, 255', '160, 250, 255']
let glowSprites: HTMLCanvasElement[] = []

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// A soft radial glow per colour, drawn once and stamped with drawImage each frame.
function makeSprites() {
  glowSprites = GLOW_RGB.map((rgb) => {
    const sprite = document.createElement('canvas')
    sprite.width = sprite.height = 64
    const g = sprite.getContext('2d')
    if (g) {
      const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
      grad.addColorStop(0, `rgba(${rgb}, 1)`)
      grad.addColorStop(0.18, `rgba(${rgb}, 0.55)`)
      grad.addColorStop(0.45, `rgba(${rgb}, 0.12)`)
      grad.addColorStop(1, `rgba(${rgb}, 0)`)
      g.fillStyle = grad
      g.fillRect(0, 0, 64, 64)
    }
    return sprite
  })
}

function build() {
  const area = w * h
  const bubbles = Math.min(90, Math.round(area / 26000))
  const snow = Math.min(70, Math.round(area / 30000))
  const glows = Math.min(28, Math.round(area / 45000))
  particles = []
  for (let i = 0; i < bubbles; i++) {
    particles.push({
      type: 'bubble',
      x: rand(0, w),
      y: rand(0, h),
      r: rand(1, 4),
      vx: rand(-0.15, 0.15),
      vy: -rand(0.25, 0.8),
      alpha: rand(0.15, 0.5),
      phase: rand(0, Math.PI * 2),
      sway: rand(0.4, 1.2),
      pulse: 0,
      hue: 0,
    })
  }
  for (let i = 0; i < snow; i++) {
    particles.push({
      type: 'snow',
      x: rand(0, w),
      y: rand(0, h),
      r: rand(0.5, 1.6),
      vx: rand(-0.1, 0.1),
      vy: rand(0.1, 0.35),
      alpha: rand(0.08, 0.28),
      phase: rand(0, Math.PI * 2),
      sway: rand(0.2, 0.7),
      pulse: 0,
      hue: 0,
    })
  }
  for (let i = 0; i < glows; i++) {
    particles.push({
      type: 'glow',
      x: rand(0, w),
      y: rand(0, h),
      r: rand(5, 11),
      vx: rand(-0.06, 0.06),
      vy: rand(-0.05, 0.05),
      alpha: rand(0.35, 0.8),
      phase: rand(0, Math.PI * 2),
      sway: rand(0.1, 0.3),
      pulse: rand(0.004, 0.012),
      hue: Math.floor(rand(0, GLOW_RGB.length)),
    })
  }
}

function resize() {
  if (!canvas.value) return
  const nw = window.innerWidth
  const nh = window.innerHeight
  // Phone URL bars resize the window as they slide. Keep the particles through that and
  // only re-seed when the width changes or the area changes a lot.
  const reseed = !particles.length || nw !== w || Math.abs(nh - h) > h * 0.3
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  w = nw
  h = nh
  canvas.value.width = Math.floor(w * dpr)
  canvas.value.height = Math.floor(h * dpr)
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
  if (reseed) build()
  measure()
  if (!running) render(0)
}

function measure() {
  // Stay invisible across the bright hero, fade in through the first scroll.
  const y = window.scrollY || 0
  const start = h * 0.35
  const end = h * 0.9
  surfaceFade = y <= start ? 0 : y >= end ? 1 : (y - start) / (end - start)
  if (page) {
    const r = page.getBoundingClientRect()
    const range = r.height - h
    depth = range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 0
  }
  else {
    const max = document.documentElement.scrollHeight - h
    depth = max > 0 ? Math.min(1, y / max) : 0
  }
}

/** Draws one frame. `dt` is elapsed time in 60 fps frames; 0 draws a still frame. */
function render(dt: number) {
  if (!ctx) return
  ctx.clearRect(0, 0, w, h)
  if (surfaceFade < 0.001) return
  // Bubbles belong near the surface, snow and glow to the deep.
  const weight = {
    bubble: 1 - 0.75 * smoothstep(0.35, 0.85, depth),
    snow: 0.55 + 0.45 * smoothstep(0.25, 0.75, depth),
    glow: smoothstep(0.55, 0.85, depth),
  }
  for (const p of particles) {
    if (dt > 0) {
      p.phase += (p.type === 'glow' ? p.pulse : 0.01) * dt
      p.x += (p.vx + Math.sin(p.phase) * p.sway * 0.15) * dt
      p.y += p.vy * dt
      if (p.type === 'bubble' && p.y < -6) { p.y = h + 6; p.x = rand(0, w) }
      if (p.type === 'snow' && p.y > h + 6) { p.y = -6; p.x = rand(0, w) }
      if (p.type === 'glow') {
        if (p.y < -p.r) p.y = h + p.r
        else if (p.y > h + p.r) p.y = -p.r
      }
      if (p.x < -12) p.x = w + 12
      else if (p.x > w + 12) p.x = -12
    }

    const a = p.alpha * weight[p.type] * surfaceFade
    if (a < 0.004) continue

    if (p.type === 'glow') {
      const sprite = glowSprites[p.hue]
      if (!sprite) continue
      ctx.globalAlpha = a * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(p.phase)))
      ctx.drawImage(sprite, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2)
      ctx.globalAlpha = 1
      continue
    }

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    if (p.type === 'bubble') {
      ctx.fillStyle = `rgba(180, 240, 255, ${a})`
      ctx.fill()
      ctx.strokeStyle = `rgba(0, 240, 255, ${a * 0.6})`
      ctx.lineWidth = 0.6
      ctx.stroke()
    }
    else {
      ctx.fillStyle = `rgba(224, 242, 254, ${a})`
      ctx.fill()
    }
  }
}

function frame(now: number) {
  // Scale movement by elapsed time, so a 120 Hz screen drifts no faster than a 60 Hz one.
  const dt = last ? Math.min(3, (now - last) / (1000 / 60)) : 1
  last = now
  render(dt)
  if (running) raf = requestAnimationFrame(frame)
}

function start() {
  if (running) return
  running = true
  last = 0
  raf = requestAnimationFrame(frame)
}

function stop() {
  running = false
  cancelAnimationFrame(raf)
}

function onScroll() {
  measure()
  // When nothing animates (reduced motion), redraw the still frame as the depth changes.
  if (!running && !pending) {
    pending = requestAnimationFrame(() => {
      pending = 0
      render(0)
    })
  }
}

function onVisibility() {
  if (document.hidden) stop()
  else if (motion.value !== 'reduce') start()
}

watch(motion, (m) => {
  if (m === 'reduce') {
    stop()
    render(0)
  }
  else if (!document.hidden) {
    start()
  }
})

onMounted(() => {
  if (!canvas.value) return
  ctx = canvas.value.getContext('2d')
  page = canvas.value.closest<HTMLElement>('.ocean-page')
  makeSprites()
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)
  if (motion.value !== 'reduce') start()
})

onBeforeUnmount(() => {
  stop()
  cancelAnimationFrame(pending)
  window.removeEventListener('resize', resize)
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>
