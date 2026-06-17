<template>
  <canvas
    ref="canvas"
    class="ocean-particles pointer-events-none fixed inset-0 z-0 h-full w-full"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
/**
 * Ambient ocean backdrop: bubbles drifting up, marine snow settling down.
 * Fixed to the viewport (cheap bitmap) and faded in once you scroll past the
 * sunlit surface, so it only shows behind the darker depth sections.
 * Honours prefers-reduced-motion by drawing a single static frame.
 */
interface Particle {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  type: 'bubble' | 'snow'
  alpha: number
  phase: number
  sway: number
}

const canvas = ref<HTMLCanvasElement | null>(null)
const motion = usePreferredReducedMotion()

let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let running = false
let particles: Particle[] = []
let w = 0
let h = 0
let dpr = 1

const rand = (min: number, max: number) => min + Math.random() * (max - min)

function build() {
  const area = w * h
  const bubbles = Math.min(90, Math.round(area / 26000))
  const snow = Math.min(70, Math.round(area / 30000))
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
    })
  }
}

function resize() {
  if (!canvas.value) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  w = window.innerWidth
  h = window.innerHeight
  canvas.value.width = Math.floor(w * dpr)
  canvas.value.height = Math.floor(h * dpr)
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
  build()
}

function depthOpacity() {
  // Stay invisible across the bright hero, fade in through the first scroll.
  const y = window.scrollY || 0
  const start = h * 0.35
  const end = h * 0.9
  if (y <= start) return 0
  if (y >= end) return 1
  return (y - start) / (end - start)
}

function draw() {
  if (!ctx) return
  ctx.clearRect(0, 0, w, h)
  const globalA = motion.value === 'reduce' ? 0.45 : depthOpacity()
  if (globalA > 0.001) {
    for (const p of particles) {
      p.phase += 0.01
      p.x += p.vx + Math.sin(p.phase) * p.sway * 0.15
      p.y += p.vy
      if (p.type === 'bubble' && p.y < -6) { p.y = h + 6; p.x = rand(0, w) }
      if (p.type === 'snow' && p.y > h + 6) { p.y = -6; p.x = rand(0, w) }
      if (p.x < -6) p.x = w + 6
      else if (p.x > w + 6) p.x = -6

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      if (p.type === 'bubble') {
        ctx.fillStyle = `rgba(180, 240, 255, ${p.alpha * globalA})`
        ctx.fill()
        ctx.strokeStyle = `rgba(0, 240, 255, ${p.alpha * globalA * 0.6})`
        ctx.lineWidth = 0.6
        ctx.stroke()
      }
      else {
        ctx.fillStyle = `rgba(224, 242, 254, ${p.alpha * globalA})`
        ctx.fill()
      }
    }
  }
  if (running) raf = requestAnimationFrame(draw)
}

function start() {
  if (running) return
  running = true
  raf = requestAnimationFrame(draw)
}

function stop() {
  running = false
  cancelAnimationFrame(raf)
}

function onVisibility() {
  if (document.hidden) stop()
  else if (motion.value !== 'reduce') start()
}

onMounted(() => {
  if (!canvas.value) return
  ctx = canvas.value.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
  document.addEventListener('visibilitychange', onVisibility)
  if (motion.value === 'reduce') draw()
  else start()
})

onBeforeUnmount(() => {
  stop()
  window.removeEventListener('resize', resize)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>
