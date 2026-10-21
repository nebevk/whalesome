// Author and licence for every Wikimedia Commons and iNaturalist photo the site uses.
// CC BY and CC BY-SA require crediting each photo, so pages show these next to the images
// and /about lists them all. Unsplash photos are free to use without attribution and have
// no entries.
import type { PhotoCredit } from '~/types/species'
import { credits as baleen } from '~/data/credits/baleen'
import { credits as toothed } from '~/data/credits/toothed'
import { credits as inaturalist } from '~/data/credits/inaturalist'
import { inatPhotoId } from '~/data/inaturalist'
import { species } from '~/data/species'

export type { PhotoCredit }

const commons: Record<string, PhotoCredit> = { ...baleen, ...toothed }

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
  if (!url) return undefined
  const photo = inatPhotoId(url)
  if (photo) return inaturalist[photo]
  const file = commonsFile(url)
  return file ? commons[file] : undefined
}

/** Every credited Commons photo, for the list on /about. */
export const allCredits = Object.entries(commons)
  .map(([file, credit]) => ({ file, ...credit }))
  .sort((a, b) => a.file.localeCompare(b.file))

/**
 * Every iNaturalist photo with the species and caption it appears with, for /about.
 * Photo ids mean nothing to readers, so these are labelled from the species data.
 */
export const inatCredits = species
  .flatMap(s => [
    { species: s.name, caption: `Main photo`, src: s.adult.image },
    ...(s.gallery ?? []).map(image => ({ species: s.name, caption: image.caption, src: image.src })),
  ])
  .flatMap((photo) => {
    const credit = creditFor(photo.src)
    return credit?.source === 'iNaturalist' ? [{ ...photo, ...credit }] : []
  })
  .filter((photo, i, all) => all.findIndex(o => o.src === photo.src) === i)
