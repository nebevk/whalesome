export interface WhaleSpecies {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  adult: {
    size: string;
    weight: string;
    characteristics: string[];
    image: string;
    facts: string[];
  };
  baby: {
    size: string;
    weight: string;
    characteristics: string[];
    /**
     * Only set when the photo really shows a calf of this species. Without it the detail
     * page shows the adult photo alone instead of the adult/calf slider. Never borrow
     * another species' calf.
     */
    image?: string;
    facts: string[];
  };
  habitat: string;
  conservationStatus: string;
  group: 'baleen' | 'toothed';
  family: string;
  featured?: boolean;
  gallery?: GalleryImage[];
  audio?: AudioClip;
  habitatRegions?: HabitatRegion[];
}

export interface AudioClip {
  /**
   * Wikimedia Commons path to the original OGG file, in the form `{a}/{ab}/{filename}.ogg`
   * (e.g. `7/79/Killer_whale.ogg`). Filename uses underscores, not spaces.
   * The component derives both the original OGG URL and the auto-generated MP3 transcode URL from this.
   */
  path: string;
  label: string;
  source: string;
}

export interface HabitatRegion {
  lat: number;
  lng: number;
  label: string;
}

/** Who to credit for a photo; see data/imageCredits.ts. */
export interface PhotoCredit {
  author: string;
  license: string;
  /** The Commons file page, or for iNaturalist photos the observation page. */
  page: string;
  /** Set for photos shared on iNaturalist, which pages credit and link differently. */
  source?: 'iNaturalist';
}

export interface GalleryImage {
  src: string;
  caption: string;
  source: 'unsplash' | 'wikimedia' | 'inaturalist';
  /**
   * Set for photos some readers may not want to see (blood, injured or dead animals).
   * The gallery and lightbox show them blurred, with this reason and a button to reveal.
   */
  sensitive?: string;
}


export type IucnCode = 'LC' | 'NT' | 'VU' | 'EN' | 'CR' | 'DD';
export type PopulationTrend = 'increasing' | 'stable' | 'decreasing' | 'unknown';

export interface WhalePopulation {
  /** Matches a WhaleSpecies id when a profile exists, so the chart can link through. */
  id: string;
  commonName: string;
  scientificName: string;
  group: 'baleen' | 'toothed';
  /** Low/high of the current global estimate. 0/0 means no reliable numeric estimate. */
  currentLow: number;
  currentHigh: number;
  currentText: string;
  /** Approximate pre-exploitation population, only where a clean figure exists. */
  prewhalingApprox?: number;
  prewhalingText?: string;
  iucnStatus: string;
  iucnCode: IucnCode;
  trend: PopulationTrend;
  note?: string;
  source: string;
}

export type WhalingEra = 'early' | 'industrial' | 'peak' | 'regulation' | 'recovery';

export interface WhalingEvent {
  year: string;
  sortYear: number;
  title: string;
  description: string;
  figure?: string;
  era: WhalingEra;
  source: string;
}

export interface WhaleStat {
  label: string;
  value: string;
  detail: string;
  source: string;
}
