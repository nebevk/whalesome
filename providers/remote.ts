import { defineProvider } from '@nuxt/image/runtime'
import { INAT_SIZES, type InatSize } from '~/data/inaturalist'

/**
 * Serves remote photos straight from their own CDNs, resized there, so nothing is
 * fetched at build time. With the default IPX provider, `nuxt generate` downloads
 * every srcset variant from Wikimedia (which throttles with 429s), and a static
 * Netlify deploy has no IPX server at runtime, so every `/_ipx/...` URL would 404.
 *
 * - images.unsplash.com: Unsplash's imgix CDN resizes via `w` / `q` query params.
 * - upload.wikimedia.org thumbnails: only fixed widths exist (see data/wikimedia.ts),
 *   so snap to the nearest step, and never above the width the data URL already uses:
 *   a thumbnail wider than the original file is an error.
 * - iNaturalist's open-data bucket stores each photo at four named sizes (see
 *   data/inaturalist.ts): pick the smallest that covers the width, never above the size
 *   the data URL names.
 * - Anything else (local files, commons Special:FilePath links) is returned untouched.
 */
const WIKIMEDIA_STEPS = [120, 250, 500, 960, 1280]
const WIKIMEDIA_THUMB = /\/(\d+)px-([^/]+)$/
const INAT_STEPS = Object.entries(INAT_SIZES).sort((a, b) => a[1] - b[1])
const INAT_PHOTO = /^(https:\/\/inaturalist-open-data\.s3\.amazonaws\.com\/photos\/\d+\/)(small|medium|large|original)(\.\w+)$/

export default defineProvider({
  getImage(src, { modifiers }) {
    const width = Number(modifiers.width) || 0

    if (src.startsWith('https://images.unsplash.com/')) {
      const url = new URL(src)
      if (width) url.searchParams.set('w', String(width))
      if (modifiers.quality) url.searchParams.set('q', String(modifiers.quality))
      if (!url.searchParams.has('auto')) url.searchParams.set('auto', 'format')
      return { url: url.toString() }
    }

    const thumb = src.startsWith('https://upload.wikimedia.org/') && width ? src.match(WIKIMEDIA_THUMB) : null
    if (thumb) {
      const current = Number(thumb[1])
      const step = WIKIMEDIA_STEPS.find(s => s >= width) ?? WIKIMEDIA_STEPS[WIKIMEDIA_STEPS.length - 1]
      return { url: src.replace(WIKIMEDIA_THUMB, `/${Math.min(step, current)}px-$2`) }
    }

    const inat = width ? src.match(INAT_PHOTO) : null
    if (inat) {
      const current = INAT_SIZES[inat[2] as InatSize]
      const [size] = INAT_STEPS.find(([, w]) => w >= Math.min(width, current)) ?? INAT_STEPS[INAT_STEPS.length - 1]
      return { url: `${inat[1]}${size}${inat[3]}` }
    }

    return { url: src }
  },
})
