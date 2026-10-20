// Author and licence for every Wikimedia Commons photo the site uses. CC BY and CC BY-SA
// require crediting each photo, so pages show these next to the images and /about lists
// them all. Unsplash photos are free to use without attribution and have no entries.
import { credits as baleen, type PhotoCredit } from '~/data/credits/baleen'
import { credits as toothed } from '~/data/credits/toothed'

export type { PhotoCredit }

const credits: Record<string, PhotoCredit> = { ...baleen, ...toothed }

/**
 * The Commons file name behind a Wikimedia URL, decoded, with underscores kept:
 * thumbnails (…/thumb/a/ab/File.jpg/960px-File.jpg), originals (…/a/ab/File.jpg)
 * and Special:FilePath links (…/Special:FilePath/File.jpg?width=960).
 */
export function commonsFile(url: string): string | null {
  if (!/(^|\.)wikimedia\.org\//.test(url.replace(/^https?:\/\//, ''))) return null
  const last = url.split(/[?#]/)[0].split('/').pop()
  if (!last) return null
  try {
    return decodeURIComponent(last.replace(/^\d+px-/, ''))
  }
  catch {
    return last
  }
}

export function creditFor(url: string | undefined): PhotoCredit | undefined {
  const file = url ? commonsFile(url) : null
  return file ? credits[file] : undefined
}

/** Every credited photo, for the list on /about. */
export const allCredits = Object.entries(credits)
  .map(([file, credit]) => ({ file, ...credit }))
  .sort((a, b) => a.file.localeCompare(b.file))
