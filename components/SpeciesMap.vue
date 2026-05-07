<template>
  <div
    ref="mapEl"
    class="rounded-lg overflow-hidden border border-base-300 bg-base-200 flex items-center justify-center text-base-content/60 text-sm"
    style="height: 360px;"
  >
    <span v-if="status">{{ status }}</span>
  </div>
</template>

<script setup lang="ts">
import type { HabitatRegion } from '~/types/species'

const props = defineProps<{ regions: HabitatRegion[] }>()

const mapEl = ref<HTMLDivElement | null>(null)
const status = ref('Loading map…')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let map: any = null

onMounted(async () => {
  console.log('[SpeciesMap] onMounted', { mapEl: mapEl.value, regions: props.regions.length })
  if (!mapEl.value) {
    status.value = 'Map container missing.'
    return
  }
  if (!props.regions.length) {
    status.value = 'No habitat data for this species.'
    return
  }

  try {
    // Explicit ESM path: leaflet's UMD `main` (`leaflet-src.js`) sometimes interops oddly
    // through Vite's dynamic-import wrapper. The ESM bundle imports cleanly.
    const mod = await import('leaflet/dist/leaflet-src.esm.js')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const L: any = (mod as any).default ?? mod
    console.log('[SpeciesMap] leaflet imported, L:', typeof L?.map)

    if (typeof L?.map !== 'function') {
      console.error('[SpeciesMap] L.map is not a function. Module shape:', mod)
      status.value = 'Leaflet failed to load.'
      return
    }

    // Clear placeholder text so Leaflet can populate the container.
    status.value = ''

    const lats = props.regions.map(r => r.lat)
    const lngs = props.regions.map(r => r.lng)
    const center: [number, number] = [
      lats.reduce((a, b) => a + b, 0) / lats.length,
      lngs.reduce((a, b) => a + b, 0) / lngs.length,
    ]
    const span = Math.max(
      Math.max(...lats) - Math.min(...lats),
      Math.max(...lngs) - Math.min(...lngs),
    )
    const zoom = span > 120 ? 1 : span > 60 ? 2 : span > 20 ? 3 : 4

    map = L.map(mapEl.value, {
      center,
      zoom,
      scrollWheelZoom: false,
      worldCopyJump: true,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(map)

    for (const region of props.regions) {
      L.circleMarker([region.lat, region.lng], {
        radius: 9,
        color: '#00f0ff',
        fillColor: '#ff3ec8',
        fillOpacity: 0.7,
        weight: 2,
      })
        .bindPopup(`<span style="font-size:0.85rem;font-weight:600">${region.label}</span>`)
        .addTo(map)
    }
    console.log('[SpeciesMap] map ready')
  }
  catch (err) {
    console.error('[SpeciesMap] init failed:', err)
    status.value = 'Map could not be loaded.'
  }
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
})
</script>

<style>
.leaflet-popup-content-wrapper,
.leaflet-popup-tip {
  background: var(--color-base-200);
  color: var(--color-base-content);
}
.leaflet-container a {
  color: var(--color-primary);
}
</style>
