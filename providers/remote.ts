import { defineProvider } from '@nuxt/image/runtime'

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
 * - Anything else (local files, commons Special:FilePath links) is returned untouched.
 */
const WIKIMEDIA_STEPS = [120, 250, 500, 960, 1280]
const WIKIMEDIA_THUMB = /\/(\d+)px-([^/]+)$/

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

    return { url: src }
  },
})
