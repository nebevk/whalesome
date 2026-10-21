/**
 * Photos from iNaturalist (https://www.inaturalist.org), a community science site where
 * anyone can share wildlife sightings that researchers then use. Only research-grade
 * observations with CC0, CC BY or CC BY-SA photos are used, hotlinked from iNaturalist's
 * open-data bucket on AWS, which exists for reuse. Every photo needs an entry in
 * data/credits/inaturalist.ts (observer, licence, observation page), and pages credit it
 * as an iNaturalist photo with a link to the sighting.
 */
export type InatSize = 'small' | 'medium' | 'large' | 'original'

/** Longest edge of each size iNaturalist stores. */
export const INAT_SIZES: Record<InatSize, number> = { small: 240, medium: 500, large: 1024, original: 2048 }

/** URL of an iNaturalist photo. `ext` must match the stored file (jpg, jpeg or png). */
export const inat = (photoId: number, ext: 'jpg' | 'jpeg' | 'png' = 'jpg', size: InatSize = 'large') =>
  `https://inaturalist-open-data.s3.amazonaws.com/photos/${photoId}/${size}.${ext}`

/** The iNaturalist photo id in a photo URL, or null for other hosts. */
export function inatPhotoId(url: string): string | null {
  const match = url.match(/^https:\/\/(?:inaturalist-open-data\.s3\.amazonaws\.com|static\.inaturalist\.org)\/photos\/(\d+)\//)
  return match ? match[1] : null
}

/** iNaturalist taxon ids for the species profiles, for “see sightings” links. */
export const inatTaxa: Record<string, number | number[]> = {
  'blue-whale': 41553,
  'humpback-whale': 41566,
  'orca': 41521,
  'beluga-whale': 41461,
  'sperm-whale': 74890,
  'narwhal': 41459,
  'gray-whale': 41478,
  'fin-whale': 41562,
  'minke-whale': 41550,
  'bowhead-whale': 74103,
  'sei-whale': 41559,
  // iNaturalist splits this into Eden's whale (Balaenoptera edeni, 41558) and Bryde's whale
  // (B. brydei, 1453916). The site follows the SMM list, one species with both forms, so
  // link both. Not the “Bryde's whale complex” taxon, which adds Omura's and Rice's whales.
  'brydes-whale': [41558, 1453916],
  'pygmy-right-whale': 41456,
  'long-finned-pilot-whale': 41529,
  'north-atlantic-right-whale': 41570,
  'southern-right-whale': 41571,
  'cuviers-beaked-whale': 41428,
  'pygmy-sperm-whale': 41464,
  'common-bottlenose-dolphin': 41482,
  'vaquita': 41443,
  'harbour-porpoise': 41440,
  'dalls-porpoise': 41446,
}

/** Sightings of one or more taxa on iNaturalist, with their map. */
export const inatSightingsUrl = (taxa: number | number[]) =>
  `https://www.inaturalist.org/observations?taxon_ids=${[taxa].flat().join(',')}`
